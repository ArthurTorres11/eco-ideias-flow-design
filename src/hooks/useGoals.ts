import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Goals {
  goal_water_monthly: number;
  goal_energy_monthly: number;
  goal_co2_monthly: number;
  goal_water_weekly: number;
  goal_energy_weekly: number;
  goal_co2_weekly: number;
  goal_water_daily: number;
  goal_energy_daily: number;
  goal_co2_daily: number;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goals>({
    goal_water_monthly: 10000,
    goal_energy_monthly: 1000,
    goal_co2_monthly: 500,
    goal_water_weekly: 2500,
    goal_energy_weekly: 250,
    goal_co2_weekly: 125,
    goal_water_daily: 350,
    goal_energy_daily: 35,
    goal_co2_daily: 18
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .like('key', 'goal_%');

      if (error) {
        console.error('Error fetching goals:', error);
        return;
      }

      if (data) {
        const goalsMap = data.reduce((acc, setting) => {
          acc[setting.key as keyof Goals] = parseFloat(setting.value) || 0;
          return acc;
        }, {} as Partial<Goals>);

        setGoals(prev => ({ ...prev, ...goalsMap }));
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  return { goals, loading, refetch: fetchGoals };
};