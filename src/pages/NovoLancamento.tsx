import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, Edit3, DollarSign, X } from 'lucide-react';

type NovoLancamentoProps = {
  embedded?: boolean;
  onClose?: () => void;
};

const NovoLancamento = ({ embedded = false, onClose }: NovoLancamentoProps) => {
  const navigate = useNavigate();
  const [tipoTransacao, setTipoTransacao] = useState('entrada');
  const [data, setData] = useState('');
  const [grupo, setGrupo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement transaction creation logic
    console.log('Nova transação:', { tipoTransacao, data, grupo, descricao, valor });
    if (embedded && onClose) {
      onClose();
    } else {
      navigate('/dashboard');
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
      <header className="pt-8 pb-4 px-6 text-center relative">
        <h1 className="text-[1.375rem] font-semibold text-[#1f2937]">Novo Lançamento</h1>
        {!embedded && (
          <button 
            onClick={handleClose}
            className="absolute right-6 top-8 flex h-10 w-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6">
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
            <label className="block text-[0.9375rem] font-medium text-[#374151] mb-2" htmlFor="data">
              Data do Lançamento
            </label>
            <div className="relative">
              <input
                className="w-full h-[52px] px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] transition-colors"
                id="data"
                placeholder="Selecione a data"
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Grupo */}
          <div>
            <label className="block text-[0.9375rem] font-medium text-[#374151] mb-2" htmlFor="grupo">
              Grupo
            </label>
            <div className="relative">
              <select
                className="w-full h-[52px] px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#3ecf8e] focus:border-[#3ecf8e] transition-colors"
                id="grupo"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
              >
                <option value="">Selecione um grupo</option>
                <option value="salario">Salário</option>
                <option value="alimentacao">Alimentação</option>
                <option value="transporte">Transporte</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
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
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-8 mt-auto pt-6">
        <button
          onClick={handleSubmit}
          className={`w-full h-14 text-white text-[1.125rem] font-semibold rounded-xl hover:bg-opacity-90 active:scale-95 transition-all duration-200 ${
            tipoTransacao === 'entrada'
              ? 'bg-[#3ecf8e] shadow-[0px_4px_12px_0px_rgba(62,207,142,0.4)]'
              : 'bg-[#FF7F6A] shadow-[0px_4px_12px_0px_rgba(255,127,106,0.4)]'
          }`}
        >
          Lançar
        </button>
      </footer>
    </div>
  );
};

export default NovoLancamento;
