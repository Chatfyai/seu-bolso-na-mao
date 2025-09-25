import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, X } from 'lucide-react';

type EmBreveEmpresaProps = {
  embedded?: boolean;
  onClose?: () => void;
};

const EmBreveEmpresa = ({ embedded = false, onClose }: EmBreveEmpresaProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (embedded && onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={"flex flex-col bg-[#f6f8f7] font-display" + (embedded ? '' : ' h-screen')}>
      {/* Header */}
      <header className="p-4 relative">
        {!embedded && (
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-black/60" />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="text-[#24e08b] mb-6">
          <Briefcase className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-extrabold text-[#24e08b] mb-4">Em Breve</h1>
        <p className="text-lg text-black/60">Recursos para Empresas estarão disponíveis em breve.</p>
      </main>
    </div>
  );
};

export default EmBreveEmpresa;


