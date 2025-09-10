import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { Target, Save } from 'lucide-react';

interface Goal {
  key: string;
  value: string;
  description: string;
}

export default function GoalsSettings() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();

  const goalPeriods = {
    daily: {
      title: 'Metas Diárias',
      icon: <Target className="w-5 h-5" />,
      suffix: '_daily'
    },
    weekly: {
      title: 'Metas Semanais', 
      icon: <Target className="w-5 h-5" />,
      suffix: '_weekly'
    },
    monthly: {
      title: 'Metas Mensais',
      icon: <Target className="w-5 h-5" />,
      suffix: '_monthly'
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value, description')
        .like('key', 'goal_%')
        .order('key');

      if (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar metas",
          variant: "destructive"
        });
        return;
      }

      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
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

  const getGoalLabel = (key: string, categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? `${category.display_name} (${category.unit})` : key;
  };

  const getGoalsForPeriod = (period: string) => {
    return goals.filter(goal => goal.key.endsWith(period));
  };

  const getCategoryFromGoalKey = (key: string) => {
    // Remove 'goal_' prefix and period suffix
    const withoutPrefix = key.replace('goal_', '');
    const withoutSuffix = withoutPrefix.replace(/_daily|_weekly|_monthly/, '');
    return withoutSuffix;
  };

  if (loading || categoriesLoading) {
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

        {Object.entries(goalPeriods).map(([period, periodInfo]) => (
          <TabsContent key={period} value={period}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {periodInfo.icon}
                  {periodInfo.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getGoalsForPeriod(periodInfo.suffix).map((goal) => {
                    const categoryName = getCategoryFromGoalKey(goal.key);
                    const category = categories.find(c => c.name === categoryName);
                    
                    return (
                      <div key={goal.key} className="space-y-2">
                        <Label className="flex items-center gap-2 font-medium">
                          {category && (
                            <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40" />
                          )}
                          {getGoalLabel(goal.key, categoryName)}
                        </Label>
                        <Input
                          type="number"
                          value={goal.value}
                          onChange={(e) => updateGoal(goal.key, e.target.value)}
                          min="0"
                          step="1"
                          className="text-base"
                        />
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
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
            <strong>Dica:</strong> As metas são usadas para calcular o progresso no dashboard "Seu Impacto". 
            Ajuste os valores de acordo com os objetivos da sua organização.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}