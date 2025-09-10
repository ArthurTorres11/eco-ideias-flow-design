import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, Save, Droplet, Bolt, Leaf } from 'lucide-react';

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

  const goalCategories = {
    daily: {
      title: 'Metas Diárias',
      icon: <Target className="w-5 h-5" />,
      goals: ['goal_water_daily', 'goal_energy_daily', 'goal_co2_daily']
    },
    weekly: {
      title: 'Metas Semanais', 
      icon: <Target className="w-5 h-5" />,
      goals: ['goal_water_weekly', 'goal_energy_weekly', 'goal_co2_weekly']
    },
    monthly: {
      title: 'Metas Mensais',
      icon: <Target className="w-5 h-5" />,
      goals: ['goal_water_monthly', 'goal_energy_monthly', 'goal_co2_monthly']
    }
  };

  const goalIcons = {
    water: <Droplet className="w-4 h-4 text-blue-500" />,
    energy: <Bolt className="w-4 h-4 text-yellow-500" />,
    co2: <Leaf className="w-4 h-4 text-green-500" />
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

  const getGoalLabel = (key: string) => {
    if (key.includes('water')) return 'Água (L)';
    if (key.includes('energy')) return 'Energia (kWh)';
    if (key.includes('co2')) return 'CO₂ (kg)';
    return key;
  };

  const getGoalIcon = (key: string) => {
    if (key.includes('water')) return goalIcons.water;
    if (key.includes('energy')) return goalIcons.energy;
    if (key.includes('co2')) return goalIcons.co2;
    return null;
  };

  const getGoalsForCategory = (categoryKeys: string[]) => {
    return goals.filter(goal => categoryKeys.includes(goal.key));
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getGoalsForCategory(category.goals).map((goal) => (
                    <div key={goal.key} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {getGoalIcon(goal.key)}
                        {getGoalLabel(goal.key)}
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
                  ))}
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