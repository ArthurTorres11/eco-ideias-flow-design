import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, Save } from 'lucide-react';

interface Goal {
  key: string;
  value: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  display_name: string;
  description: string;
  unit: string;
}

export default function GoalsSettings() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const goalCategories = {
    daily: {
      title: 'Metas Diárias',
      icon: <Target className="w-5 h-5" />,
      period: 'daily'
    },
    weekly: {
      title: 'Metas Semanais', 
      icon: <Target className="w-5 h-5" />,
      period: 'weekly'
    },
    monthly: {
      title: 'Metas Mensais',
      icon: <Target className="w-5 h-5" />,
      period: 'monthly'
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        toast({
          title: "Erro",
          description: "Erro ao carregar categorias",
          variant: "destructive"
        });
        return;
      }

      setCategories(categoriesData || []);

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('settings')
        .select('key, value, description')
        .like('key', 'goal_%')
        .order('key');

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar metas",
          variant: "destructive"
        });
        return;
      }

      setGoals(goalsData || []);

      // Create missing goals for existing categories
      await createMissingGoals(categoriesData || [], goalsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMissingGoals = async (categories: Category[], existingGoals: Goal[]) => {
    const existingKeys = existingGoals.map(g => g.key);
    const periods = ['daily', 'weekly', 'monthly'];
    const missingGoals = [];

    for (const category of categories) {
      for (const period of periods) {
        const key = `goal_${category.name}_${period}`;
        if (!existingKeys.includes(key)) {
          missingGoals.push({
            key,
            value: getDefaultValue(category.name, period),
            description: `Meta ${period === 'daily' ? 'diária' : period === 'weekly' ? 'semanal' : 'mensal'} para ${category.display_name} (${category.unit})`
          });
        }
      }
    }

    if (missingGoals.length > 0) {
      const { error } = await supabase
        .from('settings')
        .insert(missingGoals);

      if (error) {
        console.error('Error creating missing goals:', error);
      } else {
        setGoals(prev => [...prev, ...missingGoals]);
      }
    }
  };

  const getDefaultValue = (categoryName: string, period: string) => {
    const defaults = {
      water: { daily: '350', weekly: '2500', monthly: '10000' },
      energy: { daily: '35', weekly: '250', monthly: '1000' },
      waste: { daily: '18', weekly: '125', monthly: '500' }
    };
    
    return defaults[categoryName as keyof typeof defaults]?.[period as keyof typeof defaults.water] || '10';
  };

  const updateGoal = (key: string, value: string) => {
    setGoals(prev => prev.map(goal => 
      goal.key === key ? { ...goal, value } : goal
    ));
  };

  const saveGoals = async () => {
    setSaving(true);
    try {
      const updates = goals.map(goal => ({
        key: goal.key,
        value: goal.value,
        description: goal.description
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .update({ value: update.value })
          .eq('key', update.key);

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Sucesso",
        description: "Metas atualizadas com sucesso!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar metas",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getGoalsForPeriod = (period: string) => {
    return goals.filter(goal => goal.key.includes(`_${period}`));
  };

  const getCategoryFromGoalKey = (key: string) => {
    const parts = key.split('_');
    if (parts.length >= 3) {
      const categoryName = parts.slice(1, -1).join('_');
      return categories.find(cat => cat.name === categoryName);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurar Metas</h1>
        <div className="text-center py-8">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configurar Metas</h1>
        <Button onClick={saveGoals} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Metas'}
        </Button>
      </div>

      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Diárias</TabsTrigger>
          <TabsTrigger value="weekly">Semanais</TabsTrigger>
          <TabsTrigger value="monthly">Mensais</TabsTrigger>
        </TabsList>

        {Object.entries(goalCategories).map(([period, category]) => (
          <TabsContent key={period} value={period}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getGoalsForPeriod(period).map((goal) => {
                    const categoryData = getCategoryFromGoalKey(goal.key);
                    return (
                      <div key={goal.key} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          {categoryData?.display_name || goal.key} ({categoryData?.unit || 'unidades'})
                        </Label>
                        <Input
                          type="number"
                          value={goal.value}
                          onChange={(e) => updateGoal(goal.key, e.target.value)}
                          min="0"
                          step="1"
                        />
                        <p className="text-xs text-gray-500">{goal.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> As metas são automaticamente criadas baseadas nas categorias de impacto cadastradas. 
            Para adicionar novas categorias, vá em Configurações da Plataforma. Ajuste os valores de acordo com os objetivos da sua organização.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}