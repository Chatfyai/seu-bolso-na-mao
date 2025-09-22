import React, { useState } from 'react';

const Profile = () => {
  const [accountType, setAccountType] = useState('Pessoa Física');

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

        {/* Financial Summary */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-foreground">Resumo Financeiro</h2>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <span className="material-symbols-outlined text-muted-foreground">trending_up</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Receitas</p>
              <p className="text-lg font-bold text-foreground">R$ 5.800,00</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <span className="material-symbols-outlined text-muted-foreground">account_balance_wallet</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Saldo Positivo</p>
              <p className="text-lg font-bold text-foreground">R$ 3.550,00</p>
            </div>
          </div>
        </div>

        {/* Payment Reminders */}
        <div className="px-4">
          <h2 className="py-3 text-lg font-bold text-foreground">Lembretes de Pagamento</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-3 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <span className="material-symbols-outlined">home</span>
              </div>
              <div className="flex-grow">
                <p className="font-medium text-foreground">Aluguel</p>
                <p className="text-sm text-red-600">Vence em 2 dias</p>
              </div>
              <p className="font-bold text-red-600">R$ 1.500,00</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-3 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <span className="material-symbols-outlined">wifi</span>
              </div>
              <div className="flex-grow">
                <p className="font-medium text-foreground">Internet</p>
                <p className="text-sm text-red-600">Vence em 5 dias</p>
              </div>
              <p className="font-bold text-red-600">R$ 99,90</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4">
          <h2 className="py-3 pt-5 text-lg font-bold text-foreground">Lançamentos Recentes</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <div className="flex-grow">
                <p className="font-medium text-foreground">Supermercado</p>
                <p className="text-sm text-muted-foreground">Hoje</p>
              </div>
              <p className="font-medium text-red-600">- R$ 254,80</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <div className="flex-grow">
                <p className="font-medium text-foreground">Restaurante</p>
                <p className="text-sm text-muted-foreground">Ontem</p>
              </div>
              <p className="font-medium text-red-600">- R$ 75,50</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <span className="material-symbols-outlined">arrow_upward</span>
              </div>
              <div className="flex-grow">
                <p className="font-medium text-foreground">Salário</p>
                <p className="text-sm text-muted-foreground">Ontem</p>
              </div>
              <p className="font-medium text-green-500">+ R$ 5.800,00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-24"></div>

      {/* Fixed Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-sm">
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
      </footer>
    </div>
  );
};

export default Profile;