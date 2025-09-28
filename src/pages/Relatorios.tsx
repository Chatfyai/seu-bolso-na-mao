import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type RelatoriosProps = {
  embedded?: boolean;
  onClose?: () => void;
  startDate?: Date | null;
  endDate?: Date | null;
};

const Relatorios = ({ embedded = false, onClose, startDate, endDate }: RelatoriosProps) => {
  const { user } = useAuth();
  const [expensesByCategory, setExpensesByCategory] = useState<Array<{ name: string; value: number; color: string }>>([]);
  type TimeGranularity = 'D' | 'M' | 'A';
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>('M');

  useEffect(() => {
    const loadExpensesByCategory = async () => {
      try {
        if (!user) return;
        
        // Buscar transações de saída com suas categorias
        let query = supabase
          .from('transactions')
          .select(`
            amount,
            occurred_on,
            categories!inner(name, color)
          `)
          .eq('user_id', user.id)
          .eq('type', 'saida');

        // Apply date filter if both dates are selected
        if (startDate && endDate) {
          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];
          query = query.gte('occurred_on', startDateStr).lte('occurred_on', endDateStr);
        }

        query = query.order('occurred_on', { ascending: false });
        const { data: transactions, error } = await query;

        if (error) throw error;

        // Agrupar por categoria e somar valores
        const categoryTotals = new Map<string, { total: number; color: string }>();
        
        transactions?.forEach((transaction: any) => {
          const categoryName = transaction.categories?.name || 'Sem categoria';
          const categoryColor = transaction.categories?.color || '#9CA3AF';
          const amount = Math.abs(transaction.amount);
          
          if (categoryTotals.has(categoryName)) {
            categoryTotals.get(categoryName)!.total += amount;
          } else {
            categoryTotals.set(categoryName, { total: amount, color: categoryColor });
          }
        });

        // Converter para formato do gráfico e ordenar por valor
        const chartData = Array.from(categoryTotals.entries())
          .map(([name, data]) => ({
            name,
            value: data.total,
            color: data.color
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6); // Mostrar apenas as 6 maiores categorias

        setExpensesByCategory(chartData);
      } catch (e) {
        console.error('Erro ao carregar gastos por categoria', e);
      }
    };
    
    loadExpensesByCategory();
  }, [user, startDate, endDate]);

  if (!embedded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-foreground mb-6">Relatórios</h1>
          <RelatoriosContent 
            expensesByCategory={expensesByCategory}
            timeGranularity={timeGranularity}
            setTimeGranularity={setTimeGranularity}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <RelatoriosContent 
        expensesByCategory={expensesByCategory}
        timeGranularity={timeGranularity}
        setTimeGranularity={setTimeGranularity}
      />
    </div>
  );
};

type RelatoriosContentProps = {
  expensesByCategory: Array<{ name: string; value: number; color: string }>;
  timeGranularity: 'D' | 'M' | 'A';
  setTimeGranularity: (value: 'D' | 'M' | 'A') => void;
};

const RelatoriosContent = ({ expensesByCategory, timeGranularity, setTimeGranularity }: RelatoriosContentProps) => {
  return (
    <div className="space-y-6">
      {/* Header com filtros de tempo */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">Gastos por Categoria</h2>
        <ToggleGroup
          type="single"
          size="sm"
          value={timeGranularity}
          onValueChange={(val) => {
            if (val === 'D' || val === 'M' || val === 'A') {
              setTimeGranularity(val);
            }
          }}
          aria-label="Selecionar período"
        >
          <ToggleGroupItem
            value="D"
            aria-label="Dia"
            className="rounded-full w-9 h-9 p-0 text-sm font-semibold text-[#3ecf8e] data-[state=on]:bg-[#3ecf8e] data-[state=on]:text-white"
          >
            D
          </ToggleGroupItem>
          <ToggleGroupItem
            value="M"
            aria-label="Mês"
            className="rounded-full w-9 h-9 p-0 text-sm font-semibold text-[#3ecf8e] data-[state=on]:bg-[#3ecf8e] data-[state=on]:text-white"
          >
            M
          </ToggleGroupItem>
          <ToggleGroupItem
            value="A"
            aria-label="Ano"
            className="rounded-full w-9 h-9 p-0 text-sm font-semibold text-[#3ecf8e] data-[state=on]:bg-[#3ecf8e] data-[state=on]:text-white"
          >
            A
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Gráfico de Pizza */}
      {expensesByCategory.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-12">
          <span className="material-symbols-outlined text-6xl text-gray-300">pie_chart</span>
          <p className="text-center text-lg font-light text-muted-foreground">Seus gastos por categoria aparecerão aqui</p>
          <p className="text-center text-sm text-muted-foreground">Adicione algumas transações de saída para ver os dados</p>
        </div>
      ) : (
        <div className="rounded-lg p-4">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    'Valor'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend personalizada */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {expensesByCategory.map((entry, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate block">
                    {entry.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seção para futuros relatórios */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Outros Relatórios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-3 block">trending_up</span>
            <h4 className="font-medium text-foreground mb-2">Evolução Mensal</h4>
            <p className="text-sm text-muted-foreground">Em breve</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-3 block">account_balance</span>
            <h4 className="font-medium text-foreground mb-2">Fluxo de Caixa</h4>
            <p className="text-sm text-muted-foreground">Em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
