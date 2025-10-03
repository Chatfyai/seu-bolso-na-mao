import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type RelatoriosProps = {
  embedded?: boolean;
  onClose?: () => void;
  startDate?: Date | null;
  endDate?: Date | null;
};

const Relatorios = ({ embedded = false, onClose, startDate, endDate }: RelatoriosProps) => {
  const { user } = useAuth();
  const [expensesByCategory, setExpensesByCategory] = useState<Array<{ name: string; value: number; color: string; isReminder?: boolean }>>([]);
  const [monthlyData, setMonthlyData] = useState<Array<{ mes: string; gastos: number; receitas: number }>>([]);
  type TimeGranularity = 'D' | 'M' | 'A';
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>('M');

  const loadMonthlyData = async () => {
    try {
      if (!user) return;

      const currentYear = new Date().getFullYear();
      const monthlyTotals: { [key: string]: { gastos: number; receitas: number } } = {};

      // Inicializar todos os meses do ano com valores zero
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      monthNames.forEach(month => {
        monthlyTotals[month] = { gastos: 0, receitas: 0 };
      });

      // Buscar todas as transações do ano atual
      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, occurred_on')
        .eq('user_id', user.id)
        .gte('occurred_on', startOfYear)
        .lte('occurred_on', endOfYear);

      if (error) throw error;

      // Agrupar por mês
      transactions?.forEach((transaction: any) => {
        const transactionDate = new Date(transaction.occurred_on);
        const monthIndex = transactionDate.getMonth();
        const monthName = monthNames[monthIndex];
        const amount = Math.abs(transaction.amount);

        if (transaction.type === 'saida') {
          monthlyTotals[monthName].gastos += amount;
        } else if (transaction.type === 'entrada') {
          monthlyTotals[monthName].receitas += amount;
        }
      });

      // Converter para array no formato esperado pelo gráfico
      const chartData = monthNames.map(month => ({
        mes: month,
        gastos: monthlyTotals[month].gastos,
        receitas: monthlyTotals[month].receitas
      }));

      setMonthlyData(chartData);
    } catch (e) {
      console.error('Erro ao carregar dados mensais', e);
    }
  };

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
            description,
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

        // Buscar lembretes ativos para identificar transações de lembretes
        const { data: reminders, error: remindersError } = await supabase
          .from('reminders')
          .select('description')
          .eq('user_id', user.id)
          .eq('active', true);

        if (remindersError) throw remindersError;

        // Criar set com descrições dos lembretes
        const reminderDescriptions = new Set(reminders?.map(r => r.description) || []);

        // Agrupar por categoria e somar valores
        const categoryTotals = new Map<string, { total: number; color: string; isReminder: boolean }>();
        
        transactions?.forEach((transaction: any) => {
          const categoryName = transaction.categories?.name || 'Sem categoria';
          const categoryColor = transaction.categories?.color || '#9CA3AF';
          const amount = Math.abs(transaction.amount);
          
          // Verificar se é uma transação de lembrete
          const isReminder = reminderDescriptions.has(transaction.description);
          
          if (categoryTotals.has(categoryName)) {
            const existing = categoryTotals.get(categoryName)!;
            existing.total += amount;
            existing.isReminder = existing.isReminder || isReminder;
          } else {
            categoryTotals.set(categoryName, { 
              total: amount, 
              color: isReminder ? '#FF6B6B' : categoryColor, // Cor especial para lembretes
              isReminder 
            });
          }
        });

        // Converter para formato do gráfico e ordenar por valor
        const chartData = Array.from(categoryTotals.entries())
          .map(([name, data]) => ({
            name: data.isReminder ? `${name} (Lembrete)` : name,
            value: data.total,
            color: data.color,
            isReminder: data.isReminder
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6); // Mostrar apenas as 6 maiores categorias

        setExpensesByCategory(chartData);
      } catch (e) {
        console.error('Erro ao carregar gastos por categoria', e);
      }
    };
    
    loadExpensesByCategory();
    loadMonthlyData();
  }, [user, startDate, endDate]);

  if (!embedded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-16 pb-4 relative">
          {/* Botão de fechar integrado na página */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white shadow-sm"
            >
              <span className="material-symbols-outlined text-gray-500">close</span>
            </button>
          )}
          <h1 className="text-2xl font-bold text-foreground mb-6 pr-12">Relatórios</h1>
          <RelatoriosContent 
            expensesByCategory={expensesByCategory}
            monthlyData={monthlyData}
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
        monthlyData={monthlyData}
        timeGranularity={timeGranularity}
        setTimeGranularity={setTimeGranularity}
      />
    </div>
  );
};

type RelatoriosContentProps = {
  expensesByCategory: Array<{ name: string; value: number; color: string; isReminder?: boolean }>;
  monthlyData: Array<{ mes: string; gastos: number; receitas: number }>;
  timeGranularity: 'D' | 'M' | 'A';
  setTimeGranularity: (value: 'D' | 'M' | 'A') => void;
};

const RelatoriosContent = ({ expensesByCategory, monthlyData, timeGranularity, setTimeGranularity }: RelatoriosContentProps) => {
  return (
    <div className="space-y-6">

      {/* Gráfico de Linha - Gastos e Receitas Mensais */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-bold text-foreground mb-0">Gastos e Receitas - Ano Atual</h3>
        </div>
        <div className="h-[450px] w-full px-6 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="mes" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  name === 'gastos' ? 'Gastos' : 'Receitas'
                ]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => value === 'gastos' ? 'Gastos' : 'Receitas'}
              />
              <Line 
                type="monotone" 
                dataKey="gastos" 
                stroke="#FF7F6A" 
                strokeWidth={3}
                dot={{ fill: '#FF7F6A', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#FF7F6A', strokeWidth: 2 }}
                name="Gastos"
              />
              <Line 
                type="monotone" 
                dataKey="receitas" 
                stroke="#3ecf8e" 
                strokeWidth={3}
                dot={{ fill: '#3ecf8e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3ecf8e', strokeWidth: 2 }}
                name="Receitas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pizza */}
      {expensesByCategory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-lg font-bold text-foreground mb-0">Gastos por Categoria</h3>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3 h-[400px] w-full px-6 pb-6">
            <span className="material-symbols-outlined text-6xl text-gray-300">pie_chart</span>
            <p className="text-center text-lg font-light text-muted-foreground">Seus gastos por categoria aparecerão aqui</p>
            <p className="text-center text-sm text-muted-foreground">Adicione algumas transações de saída para ver os dados</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-lg font-bold text-foreground mb-0">Gastos por Categoria</h3>
          </div>
          <div className="h-[400px] w-full px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
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
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  {entry.isReminder && (
                    <span className="material-symbols-outlined text-sm text-[#FF6B6B]" title="Despesa de Lembrete">
                      event_repeat
                    </span>
                  )}
                </div>
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
