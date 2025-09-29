import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/integrations/supabase/types';

type ReminderEditModalProps = {
  reminder: Tables<{ schema: 'public' }, 'reminders'> | null;
  onClose: () => void;
  onUpdate: () => void;
};

const ReminderEditModal = ({ reminder, onClose, onUpdate }: ReminderEditModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [installmentsTotal, setInstallmentsTotal] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [markingAsPaid, setMarkingAsPaid] = useState(false);

  useEffect(() => {
    if (reminder) {
      setDescription(reminder.description);
      setAmount(Number(reminder.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
      setInstallmentsTotal(reminder.installments_total.toString());
      setPaymentDay(reminder.day_of_month?.toString() || '');
    }
  }, [reminder]);

  const parseCurrencyPtBr = (value: string) => {
    const normalized = value
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');
    const num = Number(normalized);
    return isNaN(num) ? NaN : num;
  };

  const handleSave = async () => {
    try {
      if (!user || !reminder) return;

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

      const totalInstallments = Math.max(1, parseInt(installmentsTotal || '1', 10));
      const dayOfMonth = parseInt(paymentDay, 10);
      if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) {
        toast({ title: 'Informe um dia válido', description: 'Escolha um dia entre 1 e 31' });
        return;
      }

      setSaving(true);
      const { error } = await supabase
        .from('reminders')
        .update({
          description: trimmedDescription,
          amount: parsedAmount,
          installments_total: totalInstallments,
          day_of_month: dayOfMonth,
        })
        .eq('id', reminder.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: 'Lembrete atualizado', description: 'As alterações foram salvas com sucesso.' });
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      const description = err?.message || 'Tente novamente em instantes.';
      toast({ title: 'Erro ao salvar', description });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!user || !reminder) return;
      
      if (!confirm('Tem certeza que deseja excluir este lembrete?')) return;

      setDeleting(true);
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminder.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: 'Lembrete excluído', description: 'O lembrete foi removido com sucesso.' });
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      const description = err?.message || 'Tente novamente em instantes.';
      toast({ title: 'Erro ao excluir', description });
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      if (!user || !reminder) return;

      setMarkingAsPaid(true);
      
      // 1. Criar transação de despesa
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          description: reminder.description,
          amount: reminder.amount,
          type: 'saida',
          occurred_on: new Date().toISOString().split('T')[0],
        });

      if (transactionError) throw transactionError;

      // 2. Atualizar contador de parcelas pagas
      const newInstallmentsPaid = reminder.installments_paid + 1;
      const isLastInstallment = newInstallmentsPaid >= reminder.installments_total;
      
      // 3. Calcular próxima data de vencimento (se não for a última parcela)
      let nextDueDate = reminder.next_due_date;
      if (!isLastInstallment && reminder.day_of_month) {
        const currentDue = new Date(reminder.next_due_date);
        const nextMonth = new Date(currentDue.getFullYear(), currentDue.getMonth() + 1, reminder.day_of_month);
        // Ajustar para último dia do mês se o dia não existir
        const lastDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
        if (reminder.day_of_month > lastDayOfMonth) {
          nextMonth.setDate(lastDayOfMonth);
        }
        nextDueDate = nextMonth.toISOString().split('T')[0];
      }

      // 4. Atualizar lembrete
      const { error: reminderError } = await supabase
        .from('reminders')
        .update({
          installments_paid: newInstallmentsPaid,
          next_due_date: nextDueDate,
          active: !isLastInstallment, // desativar se for a última parcela
        })
        .eq('id', reminder.id)
        .eq('user_id', user.id);

      if (reminderError) throw reminderError;

      toast({ 
        title: 'Pagamento registrado', 
        description: isLastInstallment 
          ? 'Todas as parcelas foram pagas! Lembrete concluído.' 
          : `Parcela ${newInstallmentsPaid}/${reminder.installments_total} paga.`
      });

      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      const description = err?.message || 'Tente novamente em instantes.';
      toast({ title: 'Erro ao registrar pagamento', description });
    } finally {
      setMarkingAsPaid(false);
    }
  };

  if (!reminder) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1f2937]">Editar Lembrete</h2>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Status Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Parcela {Math.min(reminder.installments_total, Math.max(1, reminder.installments_paid + 1))} de {reminder.installments_total}
            </p>
            <p className="text-sm text-gray-600">
              Próximo vencimento: {new Date(reminder.next_due_date).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Descrição
            </label>
            <input
              className="w-full h-12 bg-transparent text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg pl-4 pr-4 focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] transition-all duration-300"
              placeholder="Ex: Conta de Luz"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Valor */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Valor
            </label>
            <div className="relative flex items-center border border-gray-200 rounded-lg h-12 focus-within:border-[#FF7F6A] focus-within:ring-2 focus-within:ring-[#FF7F6A] transition-all duration-300">
              <span className="pl-4 text-lg font-medium text-gray-500">R$</span>
              <input
                className="w-full h-full bg-transparent text-gray-900 placeholder:text-gray-400 border-none rounded-lg pl-2 pr-4 text-lg font-medium focus:ring-0 focus:outline-none"
                inputMode="decimal"
                placeholder="0,00"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Parcelas */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Total de Parcelas
            </label>
            <input
              className="w-full h-12 bg-transparent text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg pl-4 pr-4 focus:ring-2 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] transition-all duration-300"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="Ex.: 12"
              value={installmentsTotal}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || Number(val) >= 1) {
                  setInstallmentsTotal(val);
                }
              }}
            />
          </div>

          {/* Dia do Pagamento */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Dia do Pagamento
            </label>
            <div className="relative flex items-center border border-gray-200 rounded-lg h-12 focus-within:border-[#3ecf8e] focus-within:ring-2 focus-within:ring-[#3ecf8e] transition-all duration-300">
              <select
                className="w-full h-full bg-transparent text-gray-900 border-none rounded-lg pl-4 pr-12 focus:ring-0 focus:outline-none appearance-none"
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

          {/* Mark as Paid Button */}
          {reminder.installments_paid < reminder.installments_total && (
            <div className="pt-2">
              <button
                onClick={handleMarkAsPaid}
                disabled={markingAsPaid || saving || deleting}
                className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {markingAsPaid ? 'Registrando...' : `Marcar Parcela ${Math.min(reminder.installments_total, reminder.installments_paid + 1)} como Paga`}
              </button>
            </div>
          )}

          {/* Edit/Delete Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDelete}
              disabled={deleting || saving || markingAsPaid}
              className="flex-1 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Excluindo...' : 'Excluir'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || deleting || markingAsPaid}
              className="flex-1 bg-[#3ecf8e] text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ecf8e] transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderEditModal;
