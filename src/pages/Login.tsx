import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Chrome } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic with Supabase
    console.log("Login attempt:", { email, password, rememberMe });
    navigate("/profile");
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth with Supabase
    console.log("Google login attempt");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground">
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-input-border bg-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 border-input-border bg-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Lembrar-me
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-medium"
          >
            Entrar
          </Button>
        </form>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
          </span>
          <button
            type="button"
            className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Criar nova conta
          </button>
        </div>

        <div className="relative">
          <Separator className="my-6" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">
              Ou
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-12 border-input-border bg-input hover:bg-muted transition-colors"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Entrar com Google
        </Button>
      </div>
    </div>
  );
};

export default Login;