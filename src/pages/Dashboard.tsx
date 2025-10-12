import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import LembretesPagamento from './LembretesPagamento';
import EmBreve from './EmBreve';
import EmBreveEmpresa from './EmBreveEmpresa';
import CountUp from './CountUp';
import NovoLancamento from './NovoLancamento';
import UltimosLancamentos from './UltimosLancamentos';
import Relatorios from './Relatorios';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DateRangePicker from '@/components/DateRangePicker';
import FinancialCarousel from '@/components/FinancialCarousel';
import UserProfile from '@/components/UserProfile';
import { supabase } from '@/integrations/supabase/client';
import SettingsPanel from '@/components/SettingsPanel';
import ReminderEditModal from '@/components/ReminderEditModal';
import AdvertisementsCarousel from '@/components/AdvertisementsCarousel';
import { Tables } from '@/integrations/supabase/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, logout } = useAuth();
  const [accountType, setAccountType] = useState('Pessoa Física');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  type PanelType = 'ia' | 'calendario' | 'relatorios' | 'planilha' | 'empresa' | 'novo' | 'ultimos' | null;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [editTx, setEditTx] = useState<{
    id: string; description: string | null; amount: number; type: 'entrada' | 'saida'; category_id: string | null; occurred_on: string
  } | null>(null);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (profile && !profile.onboarding_completed) {
        navigate('/account-type');
      }
    }
  }, [user, profile, loading, navigate]);

  // Check if it's the first time user is accessing the dashboard
  useEffect(() => {
    if (user) {
      const tutorialKey = `tutorial_shown_${user.id}`;
      const hasSeenTutorial = localStorage.getItem(tutorialKey);
      
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [user]);
  type HeaderPanelType = 'profile' | 'settings' | 'help' | null;
  const [isHeaderSheetOpen, setIsHeaderSheetOpen] = useState(false);
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<HeaderPanelType>(null);
  type TimeGranularity = 'D' | 'M' | 'A';
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>('M');
  const [recentTransactions, setRecentTransactions] = useState<Array<{ id: string; description: string | null; amount: number; type: 'entrada' | 'saida'; category_id: string | null; category_name?: string }>>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [reminders, setReminders] = useState<Array<Tables<{ schema: 'public' }, 'reminders'>>>([]);
  const [selectedReminder, setSelectedReminder] = useState<Tables<{ schema: 'public' }, 'reminders'> | null>(null);
  const [monthlyFixedExpenses, setMonthlyFixedExpenses] = useState(0);
  const [showAllReminders, setShowAllReminders] = useState(false);
  // Função para obter o primeiro e último dia do mês atual
  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { firstDay, lastDay };
  };

  const { firstDay: currentMonthStart, lastDay: currentMonthEnd } = getCurrentMonthRange();
  const [startDate, setStartDate] = useState<Date | null>(currentMonthStart);
  const [endDate, setEndDate] = useState<Date | null>(currentMonthEnd);

  const loadRecentTransactions = async () => {
    try {
      if (!user) return;
      const { data, error } = await supabase
        .from('transactions')
        .select('id, description, amount, type, category_id, categories(name)')
        .eq('user_id', user.id)
        .order('occurred_on', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      const processedData = (data || []).map((t: any) => ({
        ...t,
        category_name: t.categories?.name || null
      }));
      setRecentTransactions(processedData);
    } catch (e) {
      console.error('Erro ao carregar últimos lançamentos', e);
    }
  };

  const loadReminders = async () => {
    try {
      if (!user) return;
      const { data, error } = await supabase
        .from('reminders' as 'reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('next_due_date', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReminders(data || []);
      
      // Calcular despesas mensais fixas
      calculateMonthlyFixedExpenses(data || []);
    } catch (e) {
      console.error('Erro ao carregar lembretes', e);
    }
  };

  const calculateMonthlyFixedExpenses = (remindersData: Tables<{ schema: 'public' }, 'reminders'>[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let total = 0;
    
    remindersData.forEach(reminder => {
      // Só contar lembretes ativos
      if (!reminder.active) return;
      
      // Verificar se o lembrete tem vencimento neste mês
      const nextDue = new Date(reminder.next_due_date);
      const isCurrentMonth = nextDue.getMonth() === currentMonth && nextDue.getFullYear() === currentYear;
      
      // Verificar se já foi pago neste mês (comparando installments_paid com o que deveria ter sido pago até agora)
      const startDate = new Date(reminder.start_date);
      const monthsSinceStart = (currentYear - startDate.getFullYear()) * 12 + (currentMonth - startDate.getMonth());
      const expectedPayments = Math.min(monthsSinceStart + 1, reminder.installments_total);
      const isPaidThisMonth = reminder.installments_paid >= expectedPayments;
      
      // Se tem vencimento neste mês e não foi pago, somar ao total
      if (isCurrentMonth && !isPaidThisMonth) {
        total += Number(reminder.amount);
      }
    });
    
    setMonthlyFixedExpenses(total);
  };

  useEffect(() => {
    loadRecentTransactions();
    loadReminders();
  }, [user]);


  const loadTotals = async () => {
    try {
      if (!user) return;

      let query = supabase
        .from('transactions')
        .select('amount, type, occurred_on, id')
        .eq('user_id', user.id);

      // Sempre aplicar filtro de data (padrão: mês atual)
      const filterStartDate = startDate || currentMonthStart;
      const filterEndDate = endDate || currentMonthEnd;
      
      const startDateStr = filterStartDate.toISOString().split('T')[0];
      const endDateStr = filterEndDate.toISOString().split('T')[0];
      
      query = query.gte('occurred_on', startDateStr).lte('occurred_on', endDateStr);

      const { data, error } = await query;

      if (error) throw error;

      let income = 0;
      let expense = 0;

      (data || []).forEach((t: any) => {
        if (t.type === 'entrada') {
          income += Math.abs(Number(t.amount || 0));
        } else if (t.type === 'saida') {
          expense += Math.abs(Number(t.amount || 0));
        }
      });

      setTotalIncome(income);
      setTotalExpense(expense);
    } catch (e) {
      console.error('Erro ao carregar totais', e);
    }
  };

  useEffect(() => {
    if (user) {
      loadTotals();
    }
  }, [user, startDate, endDate]);

  // Verificar e atualizar para o mês atual quando o componente é montado ou quando o usuário muda
  useEffect(() => {
    if (user) {
      checkAndUpdateCurrentMonth();
    }
  }, [user]);

  // Função para atualizar todos os dados
  const refreshData = async () => {
    await Promise.all([loadTotals(), loadRecentTransactions(), loadReminders()]);
  };

  // Função para verificar e atualizar para o mês atual se necessário
  const checkAndUpdateCurrentMonth = () => {
    const { firstDay, lastDay } = getCurrentMonthRange();
    
    // Verificar se as datas atuais ainda correspondem ao mês atual
    if (!startDate || !endDate || 
        startDate.getMonth() !== firstDay.getMonth() || 
        startDate.getFullYear() !== firstDay.getFullYear()) {
      setStartDate(firstDay);
      setEndDate(lastDay);
    }
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    
    // Mark tutorial as seen for this user
    if (user) {
      const tutorialKey = `tutorial_shown_${user.id}`;
      localStorage.setItem(tutorialKey, 'true');
    }
  };

  const handleDateRangeChange = (newStartDate: Date | null, newEndDate: Date | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Preparar dados dos cards para o carrossel
  const financialCards = [
    {
      id: 'income',
      icon: 'trending_up',
      title: 'Entradas Totais',
      value: totalIncome,
      color: 'text-[#3ecf8e]'
    },
    {
      id: 'balance',
      icon: 'account_balance_wallet',
      title: 'Saldo',
      value: totalIncome - totalExpense,
      color: (totalIncome - totalExpense) >= 0 ? 'text-[#3ecf8e]' : 'text-[#FF7F6A]'
    },
    {
      id: 'expenses',
      icon: 'trending_down',
      title: 'Despesas Totais',
      value: totalExpense,
      color: 'text-[#FF7F6A]'
    },
    {
      id: 'fixed',
      icon: 'event_repeat',
      title: 'Despesas Mensais Fixas',
      value: monthlyFixedExpenses,
      color: 'text-[#FF7F6A]'
    }
  ];

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuItemClick = async (action: string) => {
    setShowMenu(false);
    switch (action) {
      case 'profile':
        setActiveHeaderPanel('profile');
        setIsHeaderSheetOpen(true);
        break;
      case 'settings':
        setActiveHeaderPanel('settings');
        setIsHeaderSheetOpen(true);
        break;
      case 'help':
        setActiveHeaderPanel('help');
        setIsHeaderSheetOpen(true);
        break;
      case 'logout':
        await logout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const openPanel = (panel: Exclude<PanelType, null>) => {
    setActivePanel(panel);
    setIsSheetOpen(true);
  };

  const panelTitle = (() => {
    switch (activePanel) {
      case 'ia':
        return 'IA';
      case 'calendario':
        return 'Calendário';
      case 'relatorios':
        return 'Relatórios';
      case 'planilha':
        return 'Planilha';
      case 'novo':
        return 'Lançamento';
      case 'empresa':
        return 'Empresa';
      case 'ultimos':
        return 'Últimos lançamentos';
      default:
        return '';
    }
  })();

  const headerPanelTitle = (() => {
    switch (activeHeaderPanel) {
      case 'profile':
        return 'Perfil';
      case 'settings':
        return 'Configurações';
      case 'help':
        return 'Ajuda';
      default:
        return '';
    }
  })();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      <div className="flex-grow">
        {/* Header */}
        <header className="bg-green-500 p-4 pb-12 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-light">
                Olá, {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}` 
                  : user?.email?.split('@')[0] || 'Usuário'}!
              </h1>
            </div>
            <div className="flex items-center gap-2 relative" ref={menuRef}>
              <button 
                onClick={toggleMenu}
                className="flex h-12 w-12 items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <button
                    onClick={() => handleMenuItemClick('profile')}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-gray-500">person</span>
                    Perfil
                  </button>
                  <button
                    onClick={() => handleMenuItemClick('settings')}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-gray-500">settings</span>
                    Configurações
                  </button>
                  <button
                    onClick={() => handleMenuItemClick('help')}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-gray-500">help</span>
                    Ajuda
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => handleMenuItemClick('logout')}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-red-500">logout</span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Account Type Toggle */}
        <div className="px-4 -mt-10">
          <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-white/20 p-1 backdrop-blur-sm">
            <label className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded text-sm font-medium ${
              accountType === 'Pessoa Física' 
                ? 'bg-white text-green-500 shadow-sm' 
                : 'text-white/80'
            }`}>
              <span className="truncate px-2">Pessoa Física</span>
              <input 
                checked={accountType === 'Pessoa Física'}
                onChange={() => setAccountType('Pessoa Física')}
                className="sr-only" 
                name="profile-toggle" 
                type="radio" 
                value="Pessoa Física"
              />
            </label>
            <label onClick={() => openPanel('empresa')} className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded text-sm font-medium ${
              accountType === 'Empresa' 
                ? 'bg-white text-green-500 shadow-sm' 
                : 'text-white/80'
            }`}>
              <span className="truncate px-2">Empresa</span>
              <input 
                checked={accountType === 'Empresa'}
                onChange={() => setAccountType('Empresa')}
                className="sr-only" 
                name="profile-toggle" 
                type="radio" 
                value="Empresa"
              />
            </label>
          </div>
        </div>


        {/* Advertisements Carousel */}
        <div className="px-4 mb-4 mt-6">
          <AdvertisementsCarousel />
        </div>

        {/* Financial Summary - Empty State */}
        <div className="p-4">
            <div className="flex items-center justify-start gap-3">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateRangeChange}
              />
            </div>
          <div className="mt-2">
            <FinancialCarousel cards={financialCards} />
          </div>
        </div>

        {/* Payment Reminders */}
        <div className="px-4">
          <h2 className="py-3 text-lg font-bold" style={{ color: '#C2C6CE' }}>Lembretes de Pagamento</h2>
          {reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <span className="material-symbols-outlined text-4xl text-gray-300">description</span>
              <p className="text-center text-base font-light text-muted-foreground">Ainda não há dados para aparecer aqui, adicione!</p>
            </div>
          ) : (
            <>
            <div className="space-y-3 py-2">
              {(showAllReminders ? reminders : reminders.slice(0, 4)).map((r) => {
                // cálculo usando estrutura da tabela reminders
                const nextDue = new Date(r.next_due_date + 'T00:00:00Z');
                const now = new Date();
                const msPerDay = 24 * 60 * 60 * 1000;
                const daysRemaining = Math.ceil((nextDue.getTime() - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / msPerDay);
                const currentInstallmentNumber = Math.min(r.installments_total, Math.max(1, r.installments_paid + 1));
                const finished = r.installments_paid >= r.installments_total;
                return (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedReminder(r)}
                    className={`flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${finished ? 'border-gray-300 opacity-70' : 'border-[#3ecf8e]'}`}
                  >
                    <span className={`material-symbols-outlined mr-4 ${finished ? 'text-gray-400' : 'text-[#3ecf8e]'}`}>
                      event_upcoming
                    </span>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{r.description}</p>
                      <p className="text-sm text-gray-600">Parcela {currentInstallmentNumber}/{r.installments_total}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#3ecf8e]">{`R$ ${Number(r.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>
                      <p className="text-sm text-gray-600">{daysRemaining >= 0 ? `${daysRemaining} dia${daysRemaining === 1 ? '' : 's'}` : `${Math.abs(daysRemaining)} dia${Math.abs(daysRemaining) === 1 ? '' : 's'} atrasado`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {reminders.length > 4 && (
              <div className="flex justify-center pt-3 pb-2">
                <button
                  onClick={() => setShowAllReminders(!showAllReminders)}
                  className="text-sm font-light text-[#3ecf8e] hover:underline"
                >
                  {showAllReminders ? 'Ver menos' : 'Ver mais'}
                </button>
              </div>
            )}
            </>
          )}
        </div>

        {/* Banner Card - Add Categories */}
        <div className="px-4 py-4">
          <div 
            onClick={() => {
              setActiveHeaderPanel('settings');
              setIsHeaderSheetOpen(true);
            }}
            className="relative rounded-xl overflow-hidden shadow-lg h-24 cursor-pointer"
            style={{
              backgroundImage: 'url(/banner-financeiro.png?v=1)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4">
          <h2 className="py-3 pt-5 text-lg font-bold" style={{ color: '#C2C6CE' }}>Lançamentos Recentes</h2>
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <span className="material-symbols-outlined text-4xl text-gray-300">bar_chart_4_bars</span>
              <p className="text-center text-base font-light text-muted-foreground">Ainda não há dados para aparecer aqui, adicione!</p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {recentTransactions.map((t) => (
                <div key={t.id} className={`flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 ${t.type === 'entrada' ? 'border-[#3ecf8e]' : 'border-[#FF7F6A]'}`}>
                  <span className={`material-symbols-outlined mr-4 ${t.type === 'entrada' ? 'text-[#3ecf8e]' : 'text-[#FF7F6A]'}`}>
                    {t.type === 'entrada' ? 'trending_up' : 'trending_down'}
                  </span>
                  <div className="flex-grow">
                    <p className="font-light text-gray-800">{t.category_name || t.description || (t.type === 'entrada' ? 'Entrada' : 'Saída')}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-light ${t.type === 'entrada' ? 'text-[#3ecf8e]' : 'text-[#FF7F6A]'}`}>
                      {`${t.type === 'entrada' ? '+' : '-'} R$ ${Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/30 backdrop-blur-sm p-4 z-[5]">
            <button 
              onClick={handleCloseTutorial}
              className="absolute top-6 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white"
            >
              <span className="material-symbols-outlined text-white">close</span>
            </button>
            <div className="relative flex w-full flex-col items-center justify-end" style={{marginBottom: '9rem'}}>
              <div className="relative mb-4 flex w-full justify-center">
                <div className="relative">
                  <p className="mb-2 rounded-lg bg-[#3ecf8e] px-4 py-3 text-base text-white shadow-lg">
                    Envie o seu primeiro dado aqui
                  </p>
                  <svg 
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[#3ecf8e]" 
                    fill="currentColor" 
                    height="16" 
                    viewBox="0 0 24 12" 
                    width="24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12L0 0h24L12 12z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Spacer */}
      <div className="h-24"></div>

      {/* Fixed Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="relative flex justify-around p-2">
            <button 
              onClick={() => openPanel('ia')}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[#4B5563]"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              <p className="text-xs font-medium">IA</p>
            </button>
            <button 
              onClick={() => openPanel('calendario')}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[#4B5563]"
            >
              <span className="material-symbols-outlined">calendar_today</span>
              <p className="text-xs font-medium">Calendário</p>
            </button>
            <div className="flex-1"></div>
            <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[#4B5563]" onClick={() => openPanel('relatorios')}>
              <span className="material-symbols-outlined">pie_chart</span>
              <p className="text-xs font-medium">Relatórios</p>
            </button>
            <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[#4B5563]" onClick={() => openPanel('ultimos')}>
              <span className="material-symbols-outlined">history</span>
              <p className="text-xs font-medium">Últimos</p>
            </button>
          </div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <button 
              onClick={() => openPanel('novo')}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#3ECF8E] shadow-lg"
            >
              <span className="material-symbols-outlined text-4xl">add</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Full-screen bottom-up sliding panel */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="p-0 h-screen">
          <div className="flex flex-col h-full">
            <div className="relative">
              {/* Botão de fechar integrado */}
              <button 
                onClick={() => setIsSheetOpen(false)}
                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full transition-colors z-20 bg-white shadow-sm"
              >
                <span className="material-symbols-outlined text-gray-500">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-16">
            {activePanel === 'ia' && (
              <EmBreve embedded onClose={() => setIsSheetOpen(false)} />
            )}
            {activePanel === 'calendario' && (
              <LembretesPagamento embedded onClose={() => { setIsSheetOpen(false); loadReminders(); }} />
            )}
            {activePanel === 'relatorios' && (
              <Relatorios 
                embedded 
                onClose={() => setIsSheetOpen(false)} 
                startDate={startDate}
                endDate={endDate}
              />
            )}
            {activePanel === 'planilha' && (
              <div className="px-5 py-4 text-sm text-muted-foreground">
                Visualização tipo planilha aparecerá aqui.
              </div>
            )}
            {activePanel === 'novo' && (
              <NovoLancamento 
                embedded 
                onClose={() => { setIsSheetOpen(false); setEditTx(null); }} 
                editTx={editTx}
                onTransactionSaved={refreshData}
              />
            )}
              {activePanel === 'empresa' && (
                <EmBreveEmpresa embedded onClose={() => setIsSheetOpen(false)} />
              )}
            {activePanel === 'ultimos' && (
              <UltimosLancamentos 
                embedded 
                onClose={() => setIsSheetOpen(false)} 
                onOpenNovo={() => {
                  setActivePanel('novo');
                }}
                onEditTransaction={(tx) => {
                  setEditTx(tx);
                  setActivePanel('novo');
                }}
                onDeleteTransaction={async (id) => {
                  try {
                    const { error } = await supabase
                      .from('transactions')
                      .delete()
                      .eq('id', id)
                      .eq('user_id', user?.id);
                    if (error) throw error;
                    // Atualizar os dados automaticamente
                    await refreshData();
                  } catch (e) {
                    console.error('Erro ao excluir', e);
                  }
                }}
              />
            )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Right-side sliding panel for header menu */}
      <Sheet open={isHeaderSheetOpen} onOpenChange={setIsHeaderSheetOpen}>
        <SheetContent side="right" className="p-0 h-screen w-full sm:max-w-none max-w-none">
          <div className="flex flex-col h-full">
            <div className="relative">
              {/* Botão de fechar integrado */}
              <button 
                onClick={() => setIsHeaderSheetOpen(false)}
                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full transition-colors z-20 bg-white shadow-sm"
              >
                <span className="material-symbols-outlined text-gray-500">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-16">
              {activeHeaderPanel === 'profile' && (
                <UserProfile 
                  user={user} 
                  profile={profile as any} 
                  onClose={() => setIsHeaderSheetOpen(false)} 
                />
              )}
              {activeHeaderPanel === 'settings' && (
                <SettingsPanel user={user} profile={profile as any} />
              )}
              {activeHeaderPanel === 'help' && (
                <EmBreve embedded onClose={() => setIsHeaderSheetOpen(false)} />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Reminder Edit Modal */}
      {selectedReminder && (
        <ReminderEditModal
          reminder={selectedReminder}
          onClose={() => setSelectedReminder(null)}
          onUpdate={() => {
            refreshData(); // recarrega lembretes e transações
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;