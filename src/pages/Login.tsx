import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic with Supabase
    console.log("Login attempt:", { email, password, rememberMe });
    navigate("/account-type");
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth with Supabase
    console.log("Google login attempt");
    navigate("/account-type");
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-white">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-sm">
           <header className="text-left mb-8">
             <h1 className="text-3xl font-bold text-[#1a202c] tracking-tight" style={{fontSize: '28px'}}>
               Bem-vindo ao Finance
             </h1>
             <p className="mt-2 text-base text-[#4a5568]">
               Acesse sua conta para continuar
             </p>
           </header>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2d3748]">
                E-mail
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input block w-full placeholder:text-gray-400"
                  placeholder="seuemail@exemplo.com"
                />
                <span className="material-symbols-outlined input-icon">mail</span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2d3748]">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input block w-full placeholder:text-gray-400"
                  placeholder="Sua senha"
                />
                <span className="material-symbols-outlined input-icon">lock</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="custom-checkbox"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2d3748]">
                  Lembrar-me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-[#3ecf8e] hover:text-[#2f855a] no-underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center items-center text-white btn-primary font-semibold text-base"
              >
                Entrar
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-[#718096]">Ou</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn-google flex w-full items-center justify-center gap-3 rounded-lg border border-[#e2e8f0] bg-white py-3 px-4 text-sm font-semibold text-[#2d3748] shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ecf8e] transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path>
                <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
                <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"></path>
                <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.38,34.761,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
              </svg>
              Continuar com Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#718096]">
            Não tem uma conta?{" "}
            <button
              type="button"
              className="font-semibold leading-6 text-[#3ecf8e] hover:text-[#2f855a]"
            >
              Criar nova conta
            </button>
          </p>
        </div>
      </main>
      
      <footer className="pb-6 px-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">shield</span>
          Protegido por criptografia de nível bancário
        </p>
      </footer>
    </div>
  );
};

export default Login;