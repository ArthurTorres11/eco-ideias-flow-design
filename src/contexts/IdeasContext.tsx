import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Em Análise' | 'Aprovada' | 'Reprovada';
  created_at: string;
  impact: string;
  user_id: string;
  author: string;
  file_url?: string;
  file_name?: string;
}

interface IdeasContextType {
  ideas: Idea[];
  loading: boolean;
  addIdea: (idea: {
    title: string;
    description: string;
    category: string;
    impact: string;
    file?: File;
  }) => Promise<{ success: boolean; error?: string }>;
  updateIdeaStatus: (ideaId: string, status: Idea['status']) => Promise<{ success: boolean; error?: string }>;
  getUserIdeas: () => Idea[];
  getAllIdeas: () => Idea[];
  refreshIdeas: () => Promise<void>;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export const useIdeas = () => {
  const context = useContext(IdeasContext);
  if (context === undefined) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
};

interface IdeasProviderProps {
  children: ReactNode;
}

export const IdeasProvider = ({ children }: IdeasProviderProps) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    if (session) {
      refreshIdeas();
    }
  }, [session]);

  const refreshIdeas = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('ideas')
        .select(`
          *,
          profiles(name)
        `)
        .order('created_at', { ascending: false });

      // If user is not admin, only show their own ideas
      if (user?.role !== 'admin') {
        query = query.eq('user_id', user?.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ideas:', error);
        return;
      }

      const formattedIdeas: Idea[] = (data || []).map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        status: idea.status as 'Em Análise' | 'Aprovada' | 'Reprovada',
        created_at: new Date(idea.created_at).toLocaleDateString('pt-BR'),
        impact: idea.impact,
        user_id: idea.user_id,
        author: (idea.profiles as any)?.name || 'Usuário',
        file_url: idea.file_url,
        file_name: idea.file_name
      }));

      setIdeas(formattedIdeas);
    } catch (error) {
      console.error('Error refreshing ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIdea = async (ideaData: {
    title: string;
    description: string;
    category: string;
    impact: string;
    file?: File;
  }) => {
    if (!session || !user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    setLoading(true);
    try {
      let fileUrl = null;
      let fileName = null;

      // Upload file if provided
      if (ideaData.file) {
        const fileExt = ideaData.file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('idea-files')
          .upload(filePath, ideaData.file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return { success: false, error: 'Erro ao fazer upload do arquivo' };
        }

        const { data: urlData } = supabase.storage
          .from('idea-files')
          .getPublicUrl(filePath);
        
        fileUrl = urlData.publicUrl;
        fileName = ideaData.file.name;
      }

      const { error } = await supabase
        .from('ideas')
        .insert({
          title: ideaData.title,
          description: ideaData.description,
          category: ideaData.category,
          impact: ideaData.impact,
          user_id: user.id,
          file_url: fileUrl,
          file_name: fileName
        });

      if (error) {
        console.error('Error adding idea:', error);
        return { success: false, error: 'Erro ao adicionar ideia' };
      }

      await refreshIdeas();
      return { success: true };
    } catch (error) {
      console.error('Error adding idea:', error);
      return { success: false, error: 'Erro interno' };
    } finally {
      setLoading(false);
    }
  };

  const updateIdeaStatus = async (ideaId: string, status: Idea['status']) => {
    if (!session || !user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const { error } = await supabase
        .from('ideas')
        .update({ status })
        .eq('id', ideaId);

      if (error) {
        console.error('Error updating idea status:', error);
        return { success: false, error: 'Erro ao atualizar status' };
      }

      await refreshIdeas();
      return { success: true };
    } catch (error) {
      console.error('Error updating idea status:', error);
      return { success: false, error: 'Erro interno' };
    }
  };

  const getUserIdeas = () => {
    if (!user) return [];
    return ideas.filter(idea => idea.user_id === user.id);
  };

  const getAllIdeas = () => {
    return ideas;
  };

  return (
    <IdeasContext.Provider value={{ 
      ideas, 
      loading,
      addIdea, 
      updateIdeaStatus, 
      getUserIdeas, 
      getAllIdeas,
      refreshIdeas
    }}>
      {children}
    </IdeasContext.Provider>
  );
};