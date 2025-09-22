import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('Pessoa Física');
  const [showOverlay, setShowOverlay] = useState(true);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    navigate('/profile');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      <div className="flex-grow">
        {/* Header */}
        <header className="bg-green-500 p-4 pb-12 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center bg-gray-400"></div>
              <h1 className="text-lg font-bold">Olá, Sofia!</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-12 w-12 items-center justify-center rounded-full text-white">
                <span className="material-symbols-outlined">notifications</span>
              </button>
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
            <label className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded text-sm font-medium ${
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

        {/* Financial Summary - Empty State */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-foreground">Resumo Financeiro</h2>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <span className="material-symbols-outlined text-muted-foreground">trending_up</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Receitas</p>
                <p className="text-lg font-bold text-foreground">R$ 0,00</p>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">Nenhum dado ainda.</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <span className="material-symbols-outlined text-muted-foreground">account_balance_wallet</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Saldo Positivo</p>
                <p className="text-lg font-bold text-foreground">R$ 0,00</p>
              </div>
              <div className="mt-2 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-300">add_chart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Reminders - Empty State */}
        <div className="px-4">
          <h2 className="py-3 text-lg font-bold text-foreground">Lembretes de Pagamento</h2>
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <span className="material-symbols-outlined text-4xl text-gray-300">description</span>
            <p className="text-center text-base font-light text-muted-foreground">Ainda não há dados para aparecer aqui, adicione!</p>
          </div>
        </div>

        {/* Recent Transactions - Empty State */}
        <div className="px-4">
          <h2 className="py-3 pt-5 text-lg font-bold text-foreground">Lançamentos Recentes</h2>
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <span className="material-symbols-outlined text-4xl text-gray-300">bar_chart_4_bars</span>
            <p className="text-center text-base font-light text-muted-foreground">Ainda não há dados para aparecer aqui, adicione!</p>
          </div>
        </div>

        {/* Tutorial Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/30 backdrop-blur-sm p-4 z-20">
            <button 
              onClick={handleCloseOverlay}
              className="absolute top-6 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white"
            >
              <span className="material-symbols-outlined text-white">close</span>
            </button>
            <div className="relative flex w-full flex-col items-center justify-end" style={{marginBottom: '9rem'}}>
              <div className="relative mb-4 flex w-full justify-center">
                <div className="relative">
                  <p className="mb-2 rounded-lg bg-gray-800 px-4 py-3 text-base text-white shadow-lg">
                    Envie o seu primeiro dado aqui
                  </p>
                  <svg 
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-gray-800" 
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
        <div className="border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="relative flex justify-around p-2">
            <a className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-muted-foreground" href="#">
              <span className="material-symbols-outlined">auto_awesome</span>
              <p className="text-xs font-medium">IA</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-muted-foreground" href="#">
              <span className="material-symbols-outlined">calendar_today</span>
              <p className="text-xs font-medium">Calendário</p>
            </a>
            <div className="flex-1"></div>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-muted-foreground" href="#">
              <span className="material-symbols-outlined">pie_chart</span>
              <p className="text-xs font-medium">Relatórios</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-muted-foreground" href="#">
              <span className="material-symbols-outlined">table_chart</span>
              <p className="text-xs font-medium">Planilha</p>
            </a>
          </div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-green-500 shadow-lg">
              <span className="material-symbols-outlined text-4xl">add</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;