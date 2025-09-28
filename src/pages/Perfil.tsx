import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Perfil = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const displayName = (profile?.first_name && profile?.last_name)
    ? `${profile.first_name} ${profile.last_name}`
    : user?.email?.split('@')[0] || 'Usuário';

  const initials = (() => {
    const first = profile?.first_name?.[0] || '';
    const last = profile?.last_name?.[0] || '';
    const fromName = `${first}${last}`.trim();
    if (fromName) return fromName.toUpperCase();
    const username = user?.email?.split('@')[0] || 'U';
    return username.slice(0, 2).toUpperCase();
  })();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-green-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Voltar"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-medium">Perfil</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Informações Pessoais</CardTitle>
            <CardDescription>Seus dados de perfil</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-medium text-foreground truncate">{displayName}</p>
                {user?.email && (
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Nome Completo</h3>
                <p className="text-base text-foreground">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : 'Não informado'
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Email</h3>
                <p className="text-base text-foreground">
                  {user?.email || 'Não informado'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tipo de Conta</h3>
                <p className="text-base text-foreground">
                  {profile?.account_type || 'Não informado'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Data de Criação</h3>
                <p className="text-base text-foreground">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('pt-BR')
                    : 'Não informado'
                  }
                </p>
              </div>
              
              {profile?.updated_at && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Última Atualização</h3>
                  <p className="text-base text-foreground">
                    {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Status da Conta</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Verificado</span>
                <span className={`text-sm font-medium ${
                  user?.email_confirmed_at ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {user?.email_confirmed_at ? 'Verificado' : 'Pendente'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Configuração Inicial</span>
                <span className={`text-sm font-medium ${
                  profile?.onboarding_completed ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {profile?.onboarding_completed ? 'Completa' : 'Pendente'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Ações</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/account-type')}
            >
              <span className="material-symbols-outlined mr-2 text-sm">edit</span>
              Editar Configurações
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <span className="material-symbols-outlined mr-2 text-sm">logout</span>
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
