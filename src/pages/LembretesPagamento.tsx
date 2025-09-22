import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Calendar } from 'lucide-react';

const LembretesPagamento = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('Pagamento único');
  const [paymentDate, setPaymentDate] = useState('');
  const [repetition, setRepetition] = useState('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement reminder creation logic
    console.log('Novo lembrete:', { description, amount, installments, paymentDate, repetition });
    navigate('/dashboard');
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-md relative">
          <div className="flex items-center justify-center p-4">
            <h1 className="text-xl font-semibold text-[#1f2937] text-center">
              Salvar Lembrete de Pagamento
            </h1>
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
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
              Parcelamento
            </label>
            <div className="relative">
              <select
                className="w-full h-[52px] bg-white text-gray-900 border-[1.5px] border-gray-200 rounded-lg appearance-none pl-4 pr-10 focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all duration-300 form-select"
                id="installments"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option>Pagamento único</option>
                <option>2 Parcelas</option>
                <option>3 Parcelas</option>
              </select>
            </div>
          </div>

          {/* Data do Pagamento */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="payment-date">
              Data do Pagamento
            </label>
            <div className="relative flex items-center border-[1.5px] border-gray-200 rounded-lg h-[52px] focus-within:border-[#3ecf8e] focus-within:ring-1 focus-within:ring-[#3ecf8e] transition-all duration-300">
              <input
                className="w-full h-full bg-transparent text-gray-900 placeholder:text-gray-400 border-none rounded-lg pl-4 pr-12 focus:ring-0 focus:outline-none"
                id="payment-date"
                placeholder="Selecione a data"
                type="text"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Opções de Repetição */}
          <div className="pt-2">
            <h2 className="text-lg font-semibold text-[#1f2937] mb-3">Opções de Repetição</h2>
            <div className="space-y-3">
              <label 
                className={`flex items-center p-4 h-[56px] rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  repetition === 'monthly' 
                    ? 'bg-[#f0fdf4] border-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.2)]' 
                    : 'bg-white border-gray-200'
                }`}
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <input
                  checked={repetition === 'monthly'}
                  onChange={() => setRepetition('monthly')}
                  className="form-radio h-5 w-5 text-[#3ecf8e] bg-white border-gray-300 focus:ring-[#3ecf8e] focus:ring-offset-0"
                  name="repetition"
                  type="radio"
                  value="monthly"
                />
                <span className={`ml-4 font-medium ${repetition === 'monthly' ? 'text-[#065f46]' : 'text-gray-700'}`}>
                  Todo mês no dia 15
                </span>
              </label>

              <label 
                className={`flex items-center p-4 h-[56px] rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  repetition === 'every30days' 
                    ? 'bg-[#f0fdf4] border-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.2)]' 
                    : 'bg-white border-gray-200'
                }`}
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <input
                  checked={repetition === 'every30days'}
                  onChange={() => setRepetition('every30days')}
                  className="form-radio h-5 w-5 text-[#3ecf8e] bg-white border-gray-300 focus:ring-[#3ecf8e] focus:ring-offset-0"
                  name="repetition"
                  type="radio"
                  value="every30days"
                />
                <span className={`ml-4 font-medium ${repetition === 'every30days' ? 'text-[#065f46]' : 'text-gray-700'}`}>
                  A cada 30 dias
                </span>
              </label>

              <label 
                className={`flex items-center p-4 h-[56px] rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  repetition === 'custom' 
                    ? 'bg-[#f0fdf4] border-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.2)]' 
                    : 'bg-white border-gray-200'
                }`}
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <input
                  checked={repetition === 'custom'}
                  onChange={() => setRepetition('custom')}
                  className="form-radio h-5 w-5 text-[#3ecf8e] bg-white border-gray-300 focus:ring-[#3ecf8e] focus:ring-offset-0"
                  name="repetition"
                  type="radio"
                  value="custom"
                />
                <span className={`ml-4 font-medium ${repetition === 'custom' ? 'text-[#065f46]' : 'text-gray-700'}`}>
                  Personalizado
                </span>
              </label>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white p-6">
        <div className="mx-auto max-w-md">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#3ecf8e] text-white font-semibold py-4 px-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(62,207,142,0.4)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ecf8e] transition-all duration-300 h-[56px] text-lg"
          >
            Salvar
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LembretesPagamento;
