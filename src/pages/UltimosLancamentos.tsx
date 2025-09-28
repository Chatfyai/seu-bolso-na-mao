import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type UltimosLancamentosProps = {
  embedded?: boolean;
  onClose?: () => void;
  onOpenNovo?: () => void;
  onEditTransaction?: (tx: { id: string; description: string | null; amount: number; type: 'entrada' | 'saida'; category_id: string | null; occurred_on: string }) => void;
  onDeleteTransaction?: (id: string) => void;
};

const UltimosLancamentos = ({ embedded = false, onClose, onOpenNovo, onEditTransaction, onDeleteTransaction }: UltimosLancamentosProps) => {
  const [items, setItems] = useState<Array<{ id: string; description: string | null; amount: number; type: 'entrada' | 'saida'; category_id: string | null; occurred_on: string; category_name?: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user) return;
        const { data, error } = await supabase
          .from('transactions')
          .select('id, description, amount, type, category_id, occurred_on, categories(name)')
          .eq('user_id', user.id)
          .order('occurred_on', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        const processedData = (data || []).map((t: any) => ({
          ...t,
          category_name: t.categories?.name || null
        }));
        setItems(processedData);
      } catch (e) {
        console.error('Erro ao carregar lançamentos', e);
      }
    };
    load();
  }, []);

  const formatarValor = (valor: number) => {
    const sinal = valor >= 0 ? "+ " : "- ";
    const valorAbsoluto = Math.abs(valor);
    return `${sinal}R$ ${valorAbsoluto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="space-y-3">
            {items.map((lancamento) => (
              <div 
                key={lancamento.id}
                className={`flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 ${
                  lancamento.type === 'entrada' ? 'border-[#3ecf8e]' : 'border-[#FF7F6A]'
                }`}
              >
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-light">
                      {formatarData(lancamento.occurred_on)}
                    </span>
                    <span className="text-sm font-light text-foreground">
                      {lancamento.category_name || (lancamento.type === 'entrada' ? 'Entrada' : 'Saída')}
                    </span>
                    <span className={`text-sm font-light ${
                      lancamento.type === 'entrada' ? 'text-[#3ecf8e]' : 'text-[#FF7F6A]'
                    }`}>
                      {formatarValor(lancamento.amount)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => onEditTransaction?.(lancamento)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Editar"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteTransaction?.(lancamento.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Excluir"
                    title="Excluir"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
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
          {items.map((lancamento) => (
            <div 
              key={lancamento.id}
              className={`flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 ${
                lancamento.type === 'entrada' ? 'border-[#3ecf8e]' : 'border-[#FF7F6A]'
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-light">
                    {formatarData(lancamento.occurred_on)}
                  </span>
                  <span className="text-sm font-light text-foreground">
                    {lancamento.category_name || (lancamento.type === 'entrada' ? 'Entrada' : 'Saída')}
                  </span>
                  <span className={`text-sm font-light ${
                    lancamento.type === 'entrada' ? 'text-[#3ecf8e]' : 'text-[#FF7F6A]'
                  }`}>
                    {formatarValor(lancamento.amount)}
                  </span>
                </div>
              </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditTransaction?.(lancamento)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Editar"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteTransaction?.(lancamento.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Excluir"
                      title="Excluir"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
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
