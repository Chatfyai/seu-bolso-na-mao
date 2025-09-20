import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  CreditCard, 
  Shield, 
  Bell, 
  LogOut,
  Edit,
  Building,
  Mail,
  Phone
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: "Maria Silva",
    email: "maria.silva@exemplo.com",
    phone: "(11) 99999-9999",
    accountType: "Pessoa Física",
    memberSince: "Janeiro 2024",
    avatar: "",
  });

  const handleLogout = () => {
    // TODO: Implement logout logic with Supabase
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Perfil
            </h1>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center pb-2">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {user.accountType}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="text-center text-sm text-muted-foreground">
                    Membro desde {user.memberSince}
                  </div>
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="mr-3 h-4 w-4" />
                  Gerenciar Cartões
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-3 h-4 w-4" />
                  Configurações
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="mr-3 h-4 w-4" />
                  Segurança
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="mr-3 h-4 w-4" />
                  Notificações
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nome Completo
                    </label>
                    <div className="flex items-center p-3 border rounded-md bg-muted/30">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Tipo de Conta
                    </label>
                    <div className="flex items-center p-3 border rounded-md bg-muted/30">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.accountType}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      E-mail
                    </label>
                    <div className="flex items-center p-3 border rounded-md bg-muted/30">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Telefone
                    </label>
                    <div className="flex items-center p-3 border rounded-md bg-muted/30">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurações da Conta
                </CardTitle>
                <CardDescription>
                  Personalize sua experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Notificações por E-mail</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações sobre suas finanças
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Autenticação em Dois Fatores</h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ativar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Backup de Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Mantenha suas informações seguras
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis em sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full">
                  Excluir Conta Permanentemente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;