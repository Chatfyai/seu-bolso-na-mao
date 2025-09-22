import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Setup = () => {
  const navigate = useNavigate();
  const [entradaInput, setEntradaInput] = useState('');
  const [saidaInput, setSaidaInput] = useState('');
  const [entradas, setEntradas] = useState(['Salário', 'Investimentos']);
  const [saidas, setSaidas] = useState(['Aluguel', 'Supermercado']);

  // Initialize feather icons after component mounts
  useEffect(() => {
    // Dynamically load feather icons if available
    if (window.feather) {
      window.feather.replace();
    }
  }, [entradas, saidas]);

  const addEntrada = () => {
    if (entradaInput.trim()) {
      setEntradas([...entradas, entradaInput.trim()]);
      setEntradaInput('');
    }
  };

  const addSaida = () => {
    if (saidaInput.trim()) {
      setSaidas([...saidas, saidaInput.trim()]);
      setSaidaInput('');
    }
  };

  const removeEntrada = (index: number) => {
    setEntradas(entradas.filter((_, i) => i !== index));
  };

  const removeSaida = (index: number) => {
    setSaidas(saidas.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'entrada' | 'saida') => {
    if (e.key === 'Enter') {
      if (type === 'entrada') {
        addEntrada();
      } else {
        addSaida();
      }
    }
  };

  const handleFinish = () => {
    navigate('/chart-preference');
  };

  return (
    <div className="relative min-h-screen bg-white">
      <header className="bg-transparent px-5 pb-8" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 5px)' }}>
        <div className="w-full h-1 rounded-full bg-[#e5e7eb] mb-4">
          <div className="bg-[#3ecf8e] h-1 rounded-full" style={{ width: '60%' }}></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Configuração Inicial</h1>
        <p className="text-sm text-gray-600">Configure suas principais categorias financeiras</p>
      </header>

      <main className="bg-white px-5 -mt-10 rounded-t-2xl pt-6 pb-28">
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-5 card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="text-green-500 w-5 h-5" data-feather="trending-up"></i>
              </div>
              <h2 className="text-lg font-semibold text-[#1f2937]">Entradas</h2>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="text-[#6b7280] w-5 h-5" data-feather="dollar-sign"></i>
              </span>
              <input 
                value={entradaInput}
                onChange={(e) => setEntradaInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'entrada')}
                className="w-full h-12 pl-10 pr-4 border-[1.5px] border-[#e5e7eb] rounded-lg focus:outline-none input-focus transition duration-200" 
                placeholder="Ex: Salário" 
                type="text"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {entradas.map((entrada, index) => (
                <div key={index} className="flex items-center bg-[#e6f7f1] text-[#059669] text-sm font-medium px-3 py-1.5 rounded-md border border-[#a7f3d0]">
                  <span>{entrada}</span>
                  <button className="ml-1.5" onClick={() => removeEntrada(index)}>
                    <i className="w-4 h-4" data-feather="x"></i>
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={addEntrada}
              className="w-full h-11 bg-[#3ecf8e] text-white text-sm font-medium rounded-lg mt-4 hover:bg-green-600 transition duration-200"
            >
              + Adicionar entrada
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFEAE6] flex items-center justify-center mr-3">
                <i className="text-[#FF7F6A] w-5 h-5" data-feather="trending-down"></i>
              </div>
              <h2 className="text-lg font-semibold text-[#1f2937]">Saídas</h2>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="text-[#6b7280] w-5 h-5" data-feather="dollar-sign"></i>
              </span>
              <input 
                value={saidaInput}
                onChange={(e) => setSaidaInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'saida')}
                className="w-full h-12 pl-10 pr-4 border-[1.5px] border-[#e5e7eb] rounded-lg focus:outline-none input-focus-red transition duration-200" 
                placeholder="Ex: Aluguel" 
                type="text"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {saidas.map((saida, index) => (
                <div key={index} className="flex items-center bg-[#FFEAE6] text-[#b3594b] text-sm font-medium px-3 py-1.5 rounded-md border border-[#FFD6CF]">
                  <span>{saida}</span>
                  <button className="ml-1.5" onClick={() => removeSaida(index)}>
                    <i className="w-4 h-4" data-feather="x"></i>
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={addSaida}
              className="w-full h-11 bg-[#FF7F6A] text-white text-sm font-medium rounded-lg mt-4 hover:bg-opacity-90 transition duration-200"
            >
              + Adicionar saída
            </button>
          </div>

          <div className="bg-[#e6f7f1] border-l-4 border-[#3ecf8e] rounded-lg p-4 flex items-start">
            <div className="flex-shrink-0">
              <i className="text-[#3ecf8e] w-5 h-5 mt-0.5" data-feather="info"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                Você poderá adicionar mais categorias e subcategorias quando finalizar a configuração inicial.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200">
        <button 
          onClick={handleFinish}
          className="w-full h-[52px] bg-[#3ecf8e] text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 card"
        >
          Continuar
        </button>
      </footer>
    </div>
  );
};

// Extend Window interface to include feather
declare global {
  interface Window {
    feather?: {
      replace: () => void;
    };
  }
}

export default Setup;