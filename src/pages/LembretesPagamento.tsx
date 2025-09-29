import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

type LembretesPagamentoProps = {
  embedded?: boolean;
  onClose?: () => void;
};

const LembretesPagamento = ({ embedded = false, onClose }: LembretesPagamentoProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('1');
  const [paymentDay, setPaymentDay] = useState('');
  // repetição mensal será assumida pela lógica de cálculo das parcelas no Dashboard
  const [saving, setSaving] = useState(false);

  const parseCurrencyPtBr = (value: string) => {
    // aceita formatos "1.234,56" ou "1234,56" ou "1234.56"
    const normalized = value
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');
    const num = Number(normalized);
    return isNaN(num) ? NaN : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        toast({ title: 'Sessão expirada', description: 'Faça login novamente.' });
        navigate('/login');
        return;
      }
      const trimmedDescription = description.trim();
      if (!trimmedDescription) {
        toast({ title: 'Informe a descrição', description: 'Ex.: Conta de Luz' });
        return;
      }
      const parsedAmount = parseCurrencyPtBr(amount);
      if (!isFinite(parsedAmount) || parsedAmount <= 0) {
        toast({ title: 'Informe um valor válido', description: 'Use formato 100,00' });
        return;
      }
      const totalInstallments = Math.max(1, parseInt(installments || '1', 10));
      const dayOfMonth = parseInt(paymentDay, 10);
      if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) {
        toast({ title: 'Informe um dia válido', description: 'Escolha um dia entre 1 e 31' });
        return;
      }
      // criar primeira data de vencimento no próximo mês (ou este mês se ainda não passou o dia)
      const now = new Date();
      const currentDay = now.getDate();
      let targetMonth = now.getMonth();
      let targetYear = now.getFullYear();
      
      if (currentDay >= dayOfMonth) {
        // se já passou o dia neste mês, usar próximo mês
        targetMonth += 1;
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear += 1;
        }
      }
      
      const firstDueIso = new Date(Date.UTC(targetYear, targetMonth, Math.min(dayOfMonth, new Date(targetYear, targetMonth + 1, 0).getDate())))
        .toISOString()
        .slice(0, 10);

      setSaving(true);
      // inserir na tabela reminders (já existente no seu projeto)
      const { error } = await supabase.from('reminders').insert({
        user_id: user.id,
        description: trimmedDescription,
        amount: parsedAmount,
        recurrence: 'monthly',
        day_of_month: dayOfMonth,
        start_date: firstDueIso,
        next_due_date: firstDueIso,
        installments_total: totalInstallments,
        installments_paid: 0,
        active: true,
      });
      if (error) throw error;
      toast({ title: 'Lembrete salvo', description: 'Seu lembrete foi criado com sucesso.' });
      if (embedded && onClose) {
        onClose();
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      const description = err?.message || 'Tente novamente em instantes.';
      toast({ title: 'Erro ao salvar', description });
    } finally {
      setSaving(false);
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
    <div className={"flex flex-col bg-white " + (embedded ? '' : 'min-h-screen')}>
      {/* Header */}
      <header className={"bg-white shadow-sm " + (embedded ? '' : 'sticky top-0 z-10')}>
        <div className="mx-auto max-w-md relative">
          <div className="flex items-center justify-center p-4">
            <h1 className="text-xl font-semibold text-[#1f2937] text-center">
              Salvar Lembrete de Pagamento
            </h1>
            {!embedded && (
              <button 
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white px-6 pb-28">
        <form onSubmit={handleSubmit} className="space-y-7 mt-6">
          {/* Descrição */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="description">
              Descrição
            </label>
            <div className="relative flex items-center border-[1.5px] border-gray-200 rounded-lg h-[52px] focus-within:border-[#3ecf8e] focus-within:ring-1 focus-within:ring-[#3ecf8e] transition-all duration-300">
              <input
                className="w-full h-full bg-transparent text-gray-900 placeholder:text-gray-400 border-none rounded-lg pl-4 pr-12 focus:ring-0 focus:outline-none"
                id="description"
                placeholder="Ex: Conta de Luz"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="amount">
              Valor
            </label>
            <div className="relative flex items-center border-[1.5px] border-gray-200 rounded-lg h-[52px] focus-within:border-[#FF7F6A] focus-within:ring-1 focus-within:ring-[#FF7F6A] transition-all duration-300">
              <span className="pl-4 text-lg font-medium text-gray-500">R$</span>
              <input
                className="w-full h-full bg-transparent text-gray-900 placeholder:text-gray-400 border-none rounded-lg pl-2 pr-4 text-lg font-medium focus:ring-0 focus:outline-none"
                id="amount"
                inputMode="decimal"
                placeholder="0,00"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Parcelamento */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="installments">
              Parcelamento (nº de parcelas)
            </label>
            <div className="relative flex items-center border-[1.5px] border-gray-200 rounded-lg h-[52px] focus-within:border-[#3ecf8e] focus-within:ring-1 focus-within:ring-[#3ecf8e] transition-all duration-300">
              <input
                className="w-full h-full bg-transparent text-gray-900 placeholder:text-gray-400 border-none rounded-lg pl-4 pr-4 focus:ring-0 focus:outline-none"
                id="installments"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="Ex.: 12"
                value={installments}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || Number(val) >= 1) {
                    setInstallments(val);
                  }
                }}
              />
            </div>
          </div>

          {/* Dia do Pagamento */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="payment-day">
              Dia do Pagamento
            </label>
            <div className="relative flex items-center border-[1.5px] border-gray-200 rounded-lg h-[52px] focus-within:border-[#3ecf8e] focus-within:ring-1 focus-within:ring-[#3ecf8e] transition-all duration-300">
              <select
                className="w-full h-full bg-transparent text-gray-900 border-none rounded-lg pl-4 pr-12 focus:ring-0 focus:outline-none appearance-none"
                id="payment-day"
                value={paymentDay}
                onChange={(e) => setPaymentDay(e.target.value)}
              >
                <option value="">Selecione o dia</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day.toString()}>
                    Todo dia {day}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Dica de repetição mensal */}
          <div className="pt-2">
            <p className="text-sm text-gray-500">Repetição mensal será calculada automaticamente a partir da primeira data.</p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white p-6">
        <div className="mx-auto max-w-md">
          <button
            disabled={saving}
            onClick={handleSubmit}
            className="w-full bg-[#3ecf8e] text-white font-semibold py-4 px-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(62,207,142,0.4)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ecf8e] transition-all duration-300 h-[56px] text-lg"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LembretesPagamento;
