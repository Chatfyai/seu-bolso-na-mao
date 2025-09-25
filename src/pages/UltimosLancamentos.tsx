import React from 'react';

type UltimosLancamentosProps = {
  embedded?: boolean;
  onClose?: () => void;
  onOpenNovo?: () => void;
};

const UltimosLancamentos = ({ embedded = false, onClose, onOpenNovo }: UltimosLancamentosProps) => {
  const lancamentos = [
    {
      id: 1,
      titulo: "Compras de Supermercado",
      categoria: "Alimentação",
      valor: -450.00,
      tipo: "despesa",
      icone: "shopping_cart"
    },
    {
      id: 2,
      titulo: "Salário",
      categoria: "Receita",
      valor: 3500.00,
      tipo: "receita",
      icone: "work"
    },
    {
      id: 3,
      titulo: "Aluguel de Apartamento",
      categoria: "Moradia",
      valor: -1200.00,
      tipo: "despesa",
      icone: "home"
    },
    {
      id: 4,
      titulo: "Jantar no Restaurante",
      categoria: "Lazer",
      valor: -150.00,
      tipo: "despesa",
      icone: "restaurant"
    }
  ];

  const formatarValor = (valor: number) => {
    const sinal = valor >= 0 ? "+ " : "- ";
    const valorAbsoluto = Math.abs(valor);
    return `${sinal}R$ ${valorAbsoluto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="space-y-3">
            {lancamentos.map((lancamento) => (
              <div 
                key={lancamento.id}
                className={`flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 ${
                  lancamento.tipo === 'receita' ? 'border-[#3ecf8e]' : 'border-[#e03b3b]'
                }`}
              >
                <span className={`material-symbols-outlined mr-4 ${
                  lancamento.tipo === 'receita' ? 'text-[#3ecf8e]' : 'text-[#e03b3b]'
                }`}>
                  {lancamento.icone}
                </span>
                <div className="flex-grow">
                  <p className="font-semibold text-foreground">{lancamento.titulo}</p>
                  <p className="text-sm text-muted-foreground">{lancamento.categoria}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    lancamento.tipo === 'receita' ? 'text-[#3ecf8e]' : 'text-[#e03b3b]'
                  }`}>
                    {formatarValor(lancamento.valor)}
                  </p>
                </div>
                <button className="ml-4 text-muted-foreground hover:text-foreground transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Botão FAB */}
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={onOpenNovo}
            className="bg-[#3ecf8e] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-[#2f855a] transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
      </div>
    );
  }

  // Versão standalone (não embedded)
  return (
    <div className="flex flex-col h-screen justify-between bg-background">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground mb-6">Últimos Lançamentos</h1>
        <div className="space-y-3">
          {lancamentos.map((lancamento) => (
            <div 
              key={lancamento.id}
              className={`flex items-center p-4 bg-background rounded-lg shadow-sm border-l-4 ${
                lancamento.tipo === 'receita' ? 'border-[#3ecf8e]' : 'border-[#e03b3b]'
              }`}
            >
              <span className={`material-symbols-outlined mr-4 ${
                lancamento.tipo === 'receita' ? 'text-[#3ecf8e]' : 'text-[#e03b3b]'
              }`}>
                {lancamento.icone}
              </span>
              <div className="flex-grow">
                <p className="font-semibold text-foreground">{lancamento.titulo}</p>
                <p className="text-sm text-muted-foreground">{lancamento.categoria}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  lancamento.tipo === 'receita' ? 'text-[#3ecf8e]' : 'text-[#e03b3b]'
                }`}>
                  {formatarValor(lancamento.valor)}
                </p>
              </div>
              <button className="ml-4 text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botão FAB */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={onOpenNovo}
          className="bg-[#3ecf8e] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-[#2f855a] transition-colors"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default UltimosLancamentos;
