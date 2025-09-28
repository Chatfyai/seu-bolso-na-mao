import React from 'react';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UserProfileComponentProps {
  user: User | null;
  profile: any; // Usando any temporariamente para evitar conflitos de tipo
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileComponentProps> = ({ user, profile }) => {
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuário';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOnboardingStatus = () => {
    if (!profile) return 0;
    
    let completed = 0;
    if (profile.onboarding_account_type_completed) completed++;
    if (profile.onboarding_setup_completed) completed++;
    if (profile.onboarding_charts_completed) completed++;
    if (profile.onboarding_completed) completed++;
    
    return (completed / 4) * 100;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header com Avatar e Nome */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-xl font-semibold bg-green-100 text-green-700">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">{getDisplayName()}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge variant="outline" className="mt-2">
            {profile?.account_type || 'Pessoa Física'}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600">person</span>
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Nome
              </label>
              <p className="text-sm text-foreground">
                {profile?.first_name || 'Não informado'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Sobrenome
              </label>
              <p className="text-sm text-foreground">
                {profile?.last_name || 'Não informado'}
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Email
            </label>
            <p className="text-sm text-foreground">{user?.email}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tipo de Conta
            </label>
            <p className="text-sm text-foreground">{profile?.account_type}</p>
          </div>
        </CardContent>
      </Card>

      {/* Status do Onboarding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">checklist</span>
            Configuração da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">{Math.round(getOnboardingStatus())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getOnboardingStatus()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tipo de conta</span>
              <div className="flex items-center gap-2">
                {profile?.onboarding_account_type_completed ? (
                  <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-gray-400 text-sm">radio_button_unchecked</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Configuração inicial</span>
              <div className="flex items-center gap-2">
                {profile?.onboarding_setup_completed ? (
                  <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-gray-400 text-sm">radio_button_unchecked</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Preferências de gráficos</span>
              <div className="flex items-center gap-2">
                {profile?.onboarding_charts_completed ? (
                  <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-gray-400 text-sm">radio_button_unchecked</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Configuração completa</span>
              <div className="flex items-center gap-2">
                {profile?.onboarding_completed ? (
                  <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-gray-400 text-sm">radio_button_unchecked</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">info</span>
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              ID do Usuário
            </label>
            <p className="text-xs font-mono text-foreground break-all">{user?.id}</p>
          </div>
          
          {user?.created_at && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Conta criada em
              </label>
              <p className="text-sm text-foreground">{formatDate(user.created_at)}</p>
            </div>
          )}
          
          {user?.updated_at && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Última atualização
              </label>
              <p className="text-sm text-foreground">{formatDate(user.updated_at)}</p>
            </div>
          )}
          
          {user?.last_sign_in_at && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Último acesso
              </label>
              <p className="text-sm text-foreground">{formatDate(user.last_sign_in_at)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
