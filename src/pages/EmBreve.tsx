import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, X } from 'lucide-react';

const EmBreve = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-[#f6f8f7] font-display">
      {/* Header */}
      <header className="p-4 relative">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-black/60" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="text-[#24e08b] mb-6">
          <Clock className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-extrabold text-[#24e08b] mb-4">Em Breve</h1>
        <p className="text-lg text-black/60">Estamos trabalhando para trazer novidades!</p>
      </main>
    </div>
  );
};

export default EmBreve;
