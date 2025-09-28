import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BarChart3, PieChart, TrendingUp, Info, CheckCircle, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ChartPreference = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChart, setSelectedChart] = useState('pie');

  const chartOptions = [
    {
      id: 'bar',
      label: 'Gráfico de Barras',
      description: 'Ideal para comparações diretas.',
      icon: BarChart3,
      materialIcon: 'bar_chart'
    },
    {
      id: 'pie',
      label: 'Gráfico de Pizza',
      description: 'Perfeito para ver proporções.',
      icon: PieChart,
      materialIcon: 'pie_chart'
    },
    {
      id: 'line',
      label: 'Gráfico de Linhas',
      description: 'Ótimo para visualizar tendências.',
      icon: TrendingUp,
      materialIcon: 'show_chart'
    }
  ];

  const handleSelectChart = (chartId: string) => {
    setSelectedChart(chartId);
  };

  const handleFinish = async () => {
    try {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            onboarding_charts_completed: true,
            onboarding_completed: true 
          })
          .eq('user_id', user.id);

        if (error) throw error;
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Header with Progress Bar */}
      <header className="bg-white px-6 pb-6" style={{ paddingTop: 'calc(12px + env(safe-area-inset-top))' }}>
        <div className="w-full h-1 rounded-full bg-[#e5e7eb] mb-6">
          <div className="bg-[#3ecf8e] h-1 rounded-full w-full"></div>
        </div>
        <div className="space-y-1">
          <h1 className="text-gray-800 text-xl font-semibold">Preferência de Visualização</h1>
          <p className="text-gray-600 text-[15px]">Escolha como visualizar seus dados financeiros</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-white px-5 -mt-6 rounded-t-3xl pt-6 flex-1 flex flex-col pb-36">
        <div className="space-y-3">
          {chartOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelectChart(option.id)}
              className={`chart-card flex items-center justify-between cursor-pointer transition-all duration-200 ease-in-out ${
                selectedChart === option.id ? 'selected' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedChart === option.id 
                    ? 'bg-[#dcfce7]' 
                    : 'bg-[#f1f3f4]'
                }`}>
                  <span className={`material-symbols-outlined ${
                    selectedChart === option.id 
                      ? 'text-[#3ecf8e]' 
                      : 'text-[#9ca3af]'
                  }`}>
                    {option.materialIcon}
                  </span>
                </div>
                <div>
                  <h2 className={`text-base font-semibold ${
                    selectedChart === option.id 
                      ? 'text-[#065f46]' 
                      : 'text-[#1f2937]'
                  }`}>
                    {option.label}
                  </h2>
                  <p className={`text-sm ${
                    selectedChart === option.id 
                      ? 'text-green-800 opacity-80' 
                      : 'text-gray-500'
                  }`}>
                    {option.description}
                  </p>
                </div>
              </div>
              {selectedChart === option.id ? (
                <span className="material-symbols-outlined text-[#3ecf8e] text-2xl fill-1">check_circle</span>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border border-[#e9ecef] rounded-full"></div>
                  <ChevronRight className="text-gray-400 w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-[#f0fdf4] rounded-lg flex items-start space-x-3 border-l-[3px] border-[#3ecf8e]">
          <Info className="text-[#3ecf8e] w-5 h-5 mt-0.5" />
          <p className="text-sm text-green-800">
            Você poderá alterar essa preferência a qualquer momento nas configurações do aplicativo.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200"
        style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleFinish}
          className="w-full h-[52px] bg-[#3ecf8e] text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 active:bg-green-600 transition-all"
        >
          Continuar
        </button>
      </footer>
    </div>
  );
};

export default ChartPreference;