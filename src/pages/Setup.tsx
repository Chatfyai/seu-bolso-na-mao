import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Setup = () => {
  const navigate = useNavigate();
  type Categoria = { label: string; color: string };
  const [entradaInput, setEntradaInput] = useState('');
  const [saidaInput, setSaidaInput] = useState('');
  const [entradaColor, setEntradaColor] = useState('#3ecf8e');
  const [saidaColor, setSaidaColor] = useState('#FF7F6A');
  const [entradas, setEntradas] = useState<Categoria[]>([
    { label: 'Salário', color: '#3ecf8e' },
    { label: 'Investimentos', color: '#3ecf8e' },
  ]);
  const [saidas, setSaidas] = useState<Categoria[]>([
    { label: 'Aluguel', color: '#FF7F6A' },
    { label: 'Supermercado', color: '#FF7F6A' },
  ]);

  // Initialize feather icons after component mounts
  useEffect(() => {
    // Dynamically load feather icons if available
    if (window.feather) {
      window.feather.replace();
    }
  }, [entradas, saidas]);

  const addEntrada = () => {
    if (entradaInput.trim()) {
      setEntradas([...entradas, { label: entradaInput.trim(), color: entradaColor }]);
      setEntradaInput('');
    }
  };

  const addSaida = () => {
    if (saidaInput.trim()) {
      setSaidas([...saidas, { label: saidaInput.trim(), color: saidaColor }]);
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
                className="w-full h-12 pl-10 pr-14 border-[1.5px] border-[#e5e7eb] rounded-lg focus:outline-none input-focus transition duration-200" 
                placeholder="Ex: Salário" 
                type="text"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <div className="relative w-8 h-8 rounded-md border border-[#e2e8f0] shadow-sm overflow-hidden" style={{ backgroundColor: entradaColor }}>
                  <input
                    aria-label="Escolher cor de entrada"
                    type="color"
                    value={entradaColor}
                    onChange={(e) => setEntradaColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entradaColor }}></span>
              <span>{entradaColor}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {entradas.map((entrada, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm font-medium px-3 py-1.5 rounded-md border"
                  style={{
                    backgroundColor: `${entrada.color}1A`,
                    borderColor: `${entrada.color}33`,
                    color: entrada.color,
                  }}
                >
                  <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: entrada.color }}></span>
                  <span>{entrada.label}</span>
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
                className="w-full h-12 pl-10 pr-14 border-[1.5px] border-[#e5e7eb] rounded-lg focus:outline-none input-focus-red transition duration-200" 
                placeholder="Ex: Aluguel" 
                type="text"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <div className="relative w-8 h-8 rounded-md border border-[#e2e8f0] shadow-sm overflow-hidden" style={{ backgroundColor: saidaColor }}>
                  <input
                    aria-label="Escolher cor de saída"
                    type="color"
                    value={saidaColor}
                    onChange={(e) => setSaidaColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: saidaColor }}></span>
              <span>{saidaColor}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {saidas.map((saida, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm font-medium px-3 py-1.5 rounded-md border"
                  style={{
                    backgroundColor: `${saida.color}1A`,
                    borderColor: `${saida.color}33`,
                    color: saida.color,
                  }}
                >
                  <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: saida.color }}></span>
                  <span>{saida.label}</span>
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