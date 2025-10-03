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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());

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

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    // Adicionar o item à lista de itens sendo deletados para animação
    setDeletingItems(prev => new Set(prev).add(id));
    
    // Aguardar um pouco para a animação
    setTimeout(async () => {
      // Chamar a função de exclusão
      await onDeleteTransaction?.(id);
      
      // Remover o item da lista local
      setItems(prev => prev.filter(item => item.id !== id));
      
      // Limpar estados
      setShowDeleteConfirm(null);
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300); // 300ms para a animação
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="space-y-3">
            {items.map((lancamento) => (
              <div 
                key={lancamento.id}
                className={`flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 transition-all duration-300 ${
                  lancamento.type === 'entrada' ? 'border-[#3ecf8e]' : 'border-[#FF7F6A]'
                } ${
                  deletingItems.has(lancamento.id) 
                    ? 'transform translate-x-full opacity-0' 
                    : 'transform translate-x-0 opacity-100'
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
                    onClick={() => handleDeleteClick(lancamento.id)}
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

        {/* Modal de Confirmação */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600">warning</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Excluir lançamento
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tem certeza que deseja excluir este lançamento?
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Versão standalone (não embedded)
  return (
    <div className="flex flex-col h-screen justify-between bg-background">
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
        <h1 className="text-2xl font-bold text-foreground mb-6 pr-12">Últimos Lançamentos</h1>
        <div className="space-y-3">
          {items.map((lancamento) => (
            <div 
              key={lancamento.id}
              className={`flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 transition-all duration-300 ${
                lancamento.type === 'entrada' ? 'border-[#3ecf8e]' : 'border-[#FF7F6A]'
              } ${
                deletingItems.has(lancamento.id) 
                  ? 'transform translate-x-full opacity-0' 
                  : 'transform translate-x-0 opacity-100'
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
                      onClick={() => handleDeleteClick(lancamento.id)}
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

      {/* Modal de Confirmação */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">warning</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Excluir lançamento
                </h3>
                <p className="text-sm text-gray-500">
                  Tem certeza que deseja excluir este lançamento?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UltimosLancamentos;
