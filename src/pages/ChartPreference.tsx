import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const ChartPreference = () => {
  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState('pie');

  const chartOptions = [
    {
      id: 'bar',
      label: 'Gráfico de barras',
      icon: BarChart
    },
    {
      id: 'pie',
      label: 'Gráfico de pizza',
      icon: PieChart
    },
    {
      id: 'line',
      label: 'Gráfico de linhas',
      icon: LineChart
    }
  ];

  const handleFinish = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Full Progress Bar */}
      <div className="h-2.5 w-full bg-green-500"></div>

      {/* Main Content */}
      <main className="flex flex-col px-6 pt-10 pb-6 h-screen">
        <h1 className="text-sm text-muted-foreground mt-2">
          Marque o gráfico que mais chama atenção para você
        </h1>

        <div className="space-y-5 flex-1">
          <RadioGroup value={selectedChart} onValueChange={setSelectedChart}>
            {chartOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.id}>
                  <Label
                    htmlFor={option.id}
                    className="flex items-center gap-4 rounded-xl border border-border p-4 cursor-pointer hover:bg-accent"
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="h-6 w-6 border-2 border-muted-foreground data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                    />
                    <span className="text-base flex-1 text-foreground">
                      {option.label}
                    </span>
                    <IconComponent className="w-6 h-6 text-muted-foreground" />
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <Button 
          onClick={handleFinish}
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-14 text-lg font-bold"
        >
          Pronto
        </Button>
      </main>
    </div>
  );
};

export default ChartPreference;