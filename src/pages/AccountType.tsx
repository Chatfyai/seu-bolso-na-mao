import { useNavigate } from "react-router-dom";
import { User, Briefcase, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AccountType = () => {
  const navigate = useNavigate();

  const handlePersonalAccount = () => {
    // TODO: Implement account type selection logic with Supabase
    navigate("/profile");
  };

  const handleBusinessAccount = () => {
    // Business accounts coming soon - no action for now
    console.log("Business account selected - coming soon");
  };

  return (
    <div className="min-h-screen bg-background px-4">
      {/* Header */}
      <div className="pt-12 pb-6">
        <h1 className="text-2xl font-semibold text-foreground text-center">
          Escolha o tipo de conta
        </h1>
        <Separator className="mt-6" />
      </div>

      {/* Account Options */}
      <div className="max-w-lg mx-auto mt-20 space-y-4">
        {/* Pessoa Física */}
        <div 
          onClick={handlePersonalAccount}
          className="relative flex items-center p-6 bg-card border border-border rounded-xl cursor-pointer hover:bg-accent/50 transition-colors group"
        >
          {/* Green accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
          
          {/* Icon */}
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Pessoa Física
            </h3>
            <p className="text-sm text-muted-foreground">
              Para gerenciar suas finanças pessoais.
            </p>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 ml-4">
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>

        {/* Pessoa Jurídica */}
        <div 
          onClick={handleBusinessAccount}
          className="relative flex items-center p-6 bg-card border border-border rounded-xl cursor-not-allowed opacity-90"
        >
          {/* Icon */}
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground">
                Pessoa Jurídica
              </h3>
              <Badge variant="secondary" className="bg-success/10 text-success text-xs px-2 py-1">
                Em breve
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Para gerenciar as finanças da sua empresa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountType;