import { createContext, useContext, useState, ReactNode } from 'react';

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Em Análise' | 'Aprovada' | 'Reprovada';
  date: string;
  impact: string;
  userId: string;
  author: string;
}

interface IdeasContextType {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'status' | 'date'>) => void;
  updateIdeaStatus: (ideaId: string, status: Idea['status']) => void;
  getUserIdeas: (userId: string) => Idea[];
  getAllIdeas: () => Idea[];
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

  const addIdea = (ideaData: Omit<Idea, 'id' | 'status' | 'date'>) => {
    const newIdea: Idea = {
      ...ideaData,
      id: `idea-${Date.now()}`,
      status: 'Em Análise',
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setIdeas(prev => [...prev, newIdea]);
  };

  const updateIdeaStatus = (ideaId: string, status: Idea['status']) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, status } : idea
    ));
  };

  const getUserIdeas = (userId: string) => {
    return ideas.filter(idea => idea.userId === userId);
  };

  const getAllIdeas = () => {
    return ideas;
  };

  return (
    <IdeasContext.Provider value={{ 
      ideas, 
      addIdea, 
      updateIdeaStatus, 
      getUserIdeas, 
      getAllIdeas 
    }}>
      {children}
    </IdeasContext.Provider>
  );
};