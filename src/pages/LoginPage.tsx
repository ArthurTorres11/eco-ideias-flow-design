
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // Simulate login success
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo ao Eco-Ideias.",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen eco-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 eco-green-light rounded-full flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Eco-Ideias</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full eco-green-dark hover:bg-green-800 text-white font-medium"
            >
              Entrar
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-green-700 hover:text-green-800 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
