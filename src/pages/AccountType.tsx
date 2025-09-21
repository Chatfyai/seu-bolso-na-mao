import { useNavigate } from "react-router-dom";
import { User, Briefcase, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AccountType = () => {
  const navigate = useNavigate();

  const handlePersonalAccount = () => {
    // TODO: Implement account type selection logic with Supabase
    navigate("/setup");
  };

  const handleBusinessAccount = () => {
    // Business accounts coming soon - no action for now
    console.log("Business account selected - coming soon");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-8 pb-8">
        <h1 className="text-2xl font-medium text-foreground text-center px-4">
          Escolha o tipo de conta
        </h1>
        <Separator className="mt-8 w-full" />
      </div>

      {/* Account Options - Centered in screen */}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="w-full max-w-lg px-4 space-y-4">
          {/* Pessoa Física */}
          <div 
            onClick={handlePersonalAccount}
            className="relative flex items-center p-5 bg-card border border-border rounded-2xl cursor-pointer hover:bg-accent/30 transition-all duration-200 group shadow-sm"
          >
            {/* Green accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl"></div>
            
            {/* Icon */}
            <div className="flex-shrink-0 mr-4">
              <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-1">
                Pessoa Física
              </h3>
              <p className="text-muted-foreground">
                Para gerenciar suas finanças pessoais.
              </p>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 ml-4">
              <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Pessoa Jurídica */}
          <div 
            onClick={handleBusinessAccount}
            className="relative flex items-center p-5 bg-card border border-border rounded-2xl cursor-not-allowed opacity-75 shadow-sm"
          >
            {/* Icon */}
            <div className="flex-shrink-0 mr-4">
              <div className="w-14 h-14 bg-muted/60 rounded-2xl flex items-center justify-center">
                <Briefcase className="h-7 w-7 text-muted-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-foreground">
                  Pessoa Jurídica
                </h3>
                <Badge variant="secondary" className="bg-success/15 text-success text-xs px-3 py-1 font-medium">
                  Em breve
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Para gerenciar as finanças da sua empresa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountType;