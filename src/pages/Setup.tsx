import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Info, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Setup = () => {
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState(['Ex: salário']);
  const [saidas, setSaidas] = useState(['Ex: aluguel', 'Ex: mercado']);

  const addEntrada = () => {
    setEntradas([...entradas, '']);
  };

  const addSaida = () => {
    setSaidas([...saidas, '']);
  };

  const updateEntrada = (index: number, value: string) => {
    const newEntradas = [...entradas];
    newEntradas[index] = value;
    setEntradas(newEntradas);
  };

  const updateSaida = (index: number, value: string) => {
    const newSaidas = [...saidas];
    newSaidas[index] = value;
    setSaidas(newSaidas);
  };

  const deleteEntrada = (index: number) => {
    const newEntradas = entradas.filter((_, i) => i !== index);
    setEntradas(newEntradas);
  };

  const deleteSaida = (index: number) => {
    const newSaidas = saidas.filter((_, i) => i !== index);
    setSaidas(newSaidas);
  };

  const handleFinish = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="pt-4 pb-8 px-4">
        <Progress value={50} className="w-full h-2" />
      </div>

      {/* Header Message */}
      <div className="px-4 mb-8">
        <h2 className="text-xl text-muted-foreground">
          Vamos começar...
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Para começar vamos adicionar entradas e saídas. Se houver dúvida aperte no ícone I ao lado de entrada e saída.
        </p>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6">
        {/* Entradas Card */}
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold text-foreground">Entradas</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Entradas são todas as fontes de renda, como salário, freelances, vendas, etc.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-3">
              {entradas.map((entrada, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={entrada}
                    onChange={(e) => updateEntrada(index, e.target.value)}
                    className="border-2 border-green-500 rounded-xl bg-background flex-1"
                    placeholder="Ex: salário"
                  />
                  {entradas.length > 1 && (
                    <Button
                      onClick={() => deleteEntrada(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button 
                onClick={addEntrada}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar entrada
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saídas Card */}
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold text-foreground">Saídas</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Saídas são todos os gastos e despesas, como aluguel, mercado, contas, etc.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-3">
              {saidas.map((saida, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={saida}
                    onChange={(e) => updateSaida(index, e.target.value)}
                    className="border-2 border-red-500 rounded-xl bg-background flex-1"
                    placeholder="Ex: aluguel"
                  />
                  {saidas.length > 1 && (
                    <Button
                      onClick={() => deleteSaida(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button 
                onClick={addSaida}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar saída
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pronto Button */}
      <div className="px-4 pb-8 mt-12">
        <Button 
          onClick={handleFinish}
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-14 text-lg font-medium"
        >
          Pronto
        </Button>
      </div>
    </div>
  );
};

export default Setup;