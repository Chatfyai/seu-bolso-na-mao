import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AccountType = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePersonalAccount = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Você precisa estar logado para continuar.",
        });
        navigate("/login");
        return;
      }

      // Create or update user profile
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          user_id: user.id, 
          account_type: 'personal' 
        });

      if (error) throw error;

      // Create default categories for the user
      const { error: categoriesError } = await supabase
        .rpc('create_default_categories', { user_id: user.id });

      if (categoriesError) throw categoriesError;

      toast({
        title: "Conta configurada!",
        description: "Tipo de conta salvo com sucesso.",
      });

      navigate("/setup");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessAccount = () => {
    // Business accounts coming soon - no action for now
    console.log("Business account selected - coming soon");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex-shrink-0 bg-white shadow-sm z-10">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
          <button onClick={handleBack} className="p-2 -ml-2">
            <span className="material-symbols-outlined text-gray-700">
              arrow_back_ios_new
            </span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Escolha o tipo de conta</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
        <div className="flex-1 flex flex-col justify-center p-6 space-y-6">
          {/* Pessoa Física */}
          <div 
            onClick={handlePersonalAccount}
            className={`bg-white rounded-2xl border-l-4 border-[#3ecf8e] shadow-xl transition-transform duration-300 ease-in-out hover:scale-[1.02] ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg className="text-[#3ecf8e]" fill="currentColor" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900">Pessoa Física</p>
                <p className="text-sm text-gray-500">Para suas finanças pessoais</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3ecf8e]">
                  check_circle
                </span>
                <span className="material-symbols-outlined text-[#3ecf8e]">
                  arrow_forward_ios
                </span>
              </div>
            </div>
          </div>

          {/* Pessoa Jurídica */}
          <div 
            onClick={handleBusinessAccount}
            className="bg-white rounded-2xl border border-gray-200 opacity-70 transition-transform duration-300 ease-in-out hover:scale-[1.02] cursor-not-allowed"
          >
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                <svg className="text-gray-400" fill="currentColor" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg">
                  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-gray-600">Pessoa Jurídica</p>
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">Em breve</span>
                </div>
                <p className="text-sm text-gray-400">Para as finanças da sua empresa</p>
              </div>
            </div>
          </div>

          {/* Texto informativo com espaçamento considerável */}
          <p className="text-center text-sm text-gray-500 mt-8">Você pode alterar essa configuração a qualquer momento.</p>
        </div>
      </main>
      
    </div>
  );
};

export default AccountType;