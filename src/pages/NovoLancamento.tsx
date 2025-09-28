import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, Edit3, DollarSign, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type EditTx = { id: string; description: string | null; amount: number; type: 'entrada' | 'saida'; category_id: string | null; occurred_on: string };
type NovoLancamentoProps = {
  embedded?: boolean;
  onClose?: () => void;
  editTx?: EditTx | null;
  onTransactionSaved?: () => Promise<void>;
};

const NovoLancamento = ({ embedded = false, onClose, editTx, onTransactionSaved }: NovoLancamentoProps) => {
  const navigate = useNavigate();
  const [tipoTransacao, setTipoTransacao] = useState<'entrada' | 'saida'>('entrada');
  const getToday = () => new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(getToday());
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [errors, setErrors] = useState<{ categoria?: string; valor?: string }>({});
  const [categorias, setCategorias] = useState<Array<{ id: string; name: string; type: 'entrada' | 'saida'; color: string }>>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user) return;
        const { data: rows, error } = await supabase
          .from('categories')
          .select('id, name, type, color')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (error) throw error;
        setCategorias((rows || []) as any);
      } catch (e) {
        console.error('Erro ao carregar categorias', e);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    if (editTx) {
      setTipoTransacao(editTx.type);
      setData(editTx.occurred_on);
      setCategoria(editTx.category_id || '');
      setDescricao(editTx.description || '');
      try {
        setValor(Number(editTx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
      } catch {
        setValor(String(editTx.amount));
      }
    }
  }, [editTx]);

  useEffect(() => {
    // Ao trocar o tipo, limpe a categoria para evitar inconsistência
    setCategoria('');
  }, [tipoTransacao]);

  // Fechar calendário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showCalendar && !target.closest('.calendar-container')) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const categoriasFiltradas = useMemo(() => categorias.filter(c => c.type === tipoTransacao), [categorias, tipoTransacao]);

  // Funções do calendário
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const selectDate = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setData(selectedDate.toISOString().slice(0, 10));
    setShowCalendar(false);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Selecionar data';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { categoria?: string; valor?: string } = {};
    const amountNumber = parseFloat(String(valor).replace(/\./g, '').replace(',', '.'));
    if (!categoria) newErrors.categoria = 'Selecione uma categoria';
    if (!valor || isNaN(amountNumber) || amountNumber === 0) newErrors.valor = 'Informe um valor válido';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        return;
      }
      if (editTx) {
        const { error } = await supabase
          .from('transactions')
          .update({
            category_id: categoria || null,
            type: tipoTransacao,
            description: descricao || null,
            amount: isNaN(amountNumber) ? 0 : amountNumber,
            occurred_on: data,
          })
          .eq('id', editTx.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            category_id: categoria || null,
            type: tipoTransacao,
            description: descricao || null,
            amount: isNaN(amountNumber) ? 0 : amountNumber,
            occurred_on: data,
          });
        if (error) throw error;
      }
      
      // Atualizar os dados automaticamente
      if (onTransactionSaved) {
        await onTransactionSaved();
      }
      
      if (embedded && onClose) {
        onClose();
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      console.error('Erro ao salvar transação', e);
    }
  };

  const handleClose = () => {
    if (embedded && onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={"flex flex-col h-full max-w-md mx-auto bg-white " + (embedded ? '' : 'min-h-screen')}>
      {/* Header */}
      {!embedded && (
        <header className="pt-8 pb-4 px-6 text-center relative">
          <h1 className="text-2xl font-bold text-foreground">
            {editTx ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h1>
          <button 
            onClick={handleClose}
            className="absolute right-6 top-8 flex h-10 w-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-grow px-6 ${embedded ? 'pt-6' : ''}`}>
        {/* Toggle Entrada/Saída */}
        <div className="mb-6">
          <div className="relative flex items-center bg-[#f1f5f9] rounded-xl p-1 h-12 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]">
            <input
              checked={tipoTransacao === 'entrada'}
              onChange={() => setTipoTransacao('entrada')}
              className="sr-only"
              id="entrada"
              name="tipo-transacao"
              type="radio"
              value="entrada"
            />
            <label
              className={`flex-1 text-center text-base font-semibold py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                tipoTransacao === 'entrada'
                  ? 'bg-[#3ecf8e] text-white shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]'
                  : 'text-[#374151]'
              }`}
              htmlFor="entrada"
            >
              Entrada
            </label>
            <input
              checked={tipoTransacao === 'saida'}
              onChange={() => setTipoTransacao('saida')}
              className="sr-only"
              id="saida"
              name="tipo-transacao"
              type="radio"
              value="saida"
            />
            <label
              className={`flex-1 text-center text-base font-medium py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                tipoTransacao === 'saida'
                  ? 'bg-[#FF7F6A] text-white shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]'
                  : 'text-[#FF7F6A]'
              }`}
              htmlFor="saida"
            >
              Saída
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data */}
          <div>
            <label className="block text-[0.9375rem] font-medium text-[#374151] mb-2">
              Data do Lançamento
            </label>
            <div className="relative calendar-container">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full h-[52px] px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg text-left focus:outline-none focus:ring-1 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] transition-colors flex items-center justify-between"
              >
                <span className="text-[#374151]">{formatDisplayDate(data)}</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </button>
              
              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-full">
                  {/* Header do calendário */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => navigateMonth('prev')}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <h3 className="font-semibold text-gray-800">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    
                    <button
                      type="button"
                      onClick={() => navigateMonth('next')}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Dias da semana */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map(day => (
                      <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Grid do calendário */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const daysInMonth = getDaysInMonth(currentMonth);
                      const firstDay = getFirstDayOfMonth(currentMonth);
                      const days = [];
                      const selectedDate = new Date(data + 'T00:00:00');
                      const today = new Date();

                      // Células vazias para os dias antes do primeiro dia do mês
                      for (let i = 0; i < firstDay; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="h-10"></div>
                        );
                      }

                      // Dias do mês
                      for (let day = 1; day <= daysInMonth; day++) {
                        const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
                        const isToday = dayDate.toDateString() === today.toDateString();
                        
                        days.push(
                          <button
                            key={day}
                            type="button"
                            onClick={() => selectDate(day)}
                            className={`h-10 rounded-md text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-[#3ecf8e] text-white'
                                : isToday
                                ? 'bg-[#3ecf8e]/20 text-[#3ecf8e] font-semibold'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }

                      return days;
                    })()}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setData(getToday());
                        setShowCalendar(false);
                      }}
                      className="px-3 py-1 text-xs bg-[#3ecf8e] text-white rounded-md hover:bg-[#3ecf8e]/90 transition-colors"
                    >
                      Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-[0.9375rem] font-medium text-[#374151] mb-2" htmlFor="categoria">
              Categoria
            </label>
            <div className="relative">
              <select
                className="w-full h-[52px] px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] transition-colors"
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                {categoriasFiltradas.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {errors.categoria && <p className="mt-1 text-xs text-red-500">{errors.categoria}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-[0.9375rem] font-medium text-[#374151] mb-2" htmlFor="descricao">
              Descrição
            </label>
            <div className="relative">
              <input
                className="w-full h-[52px] px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] transition-colors"
                id="descricao"
                placeholder="Ex: Adiantamento quinzenal"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Edit3 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-[0.9375rem] font-medium text-[#374151] mb-2" htmlFor="valor">
              Valor
            </label>
            <div className="relative flex items-center w-full h-[52px] px-4 bg-white border border-[#e5e7eb] rounded-lg focus-within:ring-1 focus-within:ring-[#3ecf8e] focus-within:border-[#3ecf8e] transition-colors">
              <span className="text-lg font-medium text-gray-400 mr-2">R$</span>
              <div className="w-px h-6 bg-[#e5e7eb] mr-2"></div>
              <input
                className="w-full h-full bg-transparent border-0 p-0 text-[1.125rem] font-medium text-[#1f2937] placeholder-gray-400 focus:ring-0 focus:outline-none"
                id="valor"
                inputMode="decimal"
                placeholder="0,00"
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            {errors.valor && <p className="mt-1 text-xs text-red-500">{errors.valor}</p>}
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-8 mt-auto pt-6">
        <button
          onClick={handleSubmit}
          disabled={!categoria || !valor}
          className={`w-full h-14 text-white text-[1.125rem] font-semibold rounded-xl hover:bg-opacity-90 active:scale-95 transition-all duration-200 ${
            tipoTransacao === 'entrada'
              ? 'bg-[#3ecf8e] shadow-[0px_4px_12px_0px_rgba(62,207,142,0.4)]'
              : 'bg-[#FF7F6A] shadow-[0px_4px_12px_0px_rgba(255,127,106,0.4)]'
          } ${(!categoria || !valor) ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          Lançar
        </button>
      </footer>
    </div>
  );
};

export default NovoLancamento;
