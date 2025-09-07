
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useIdeas } from "@/contexts/IdeasContext";

const NewIdeaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addIdea } = useIdeas();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    impactValue: "",
    unit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para submeter uma ideia.",
        variant: "destructive",
      });
      return;
    }

    // Create impact string
    let impactString = "Impacto estimado";
    if (formData.impactValue && formData.unit) {
      impactString = `${formData.impactValue} ${formData.unit}`;
    }

    // Add idea to context
    addIdea({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      impact: impactString,
      userId: user.id,
      author: user.name,
    });

    toast({
      title: "Ideia enviada com sucesso!",
      description: "Sua eco-ideia foi submetida para análise.",
    });
    
    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 text-center">
              Qual é a sua Eco-Ideia?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Título da Ideia *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Digite o título da sua ideia..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Descrição Detalhada da Ideia *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva sua ideia em detalhes..."
                  className="mt-2 min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-base font-medium">
                  Principal Categoria de Impacto *
                </Label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione uma categoria..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">Conservação de Água</SelectItem>
                    <SelectItem value="energy">Eficiência Energética</SelectItem>
                    <SelectItem value="waste">Redução de Resíduos</SelectItem>
                    <SelectItem value="transport">Transporte Sustentável</SelectItem>
                    <SelectItem value="materials">Materiais Sustentáveis</SelectItem>
                    <SelectItem value="biodiversity">Biodiversidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="impact-value" className="text-base font-medium">
                    Valor do Impacto
                  </Label>
                  <Input
                    id="impact-value"
                    type="number"
                    value={formData.impactValue}
                    onChange={(e) => handleInputChange("impactValue", e.target.value)}
                    placeholder="0"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="unit" className="text-base font-medium">
                    Unidade de Medida
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liters">Litros</SelectItem>
                      <SelectItem value="kwh">kWh</SelectItem>
                      <SelectItem value="kg">Quilogramas</SelectItem>
                      <SelectItem value="tons">Toneladas</SelectItem>
                      <SelectItem value="percent">Porcentagem (%)</SelectItem>
                      <SelectItem value="units">Unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full eco-green-dark hover:bg-green-800 text-white text-lg py-6 h-auto"
                >
                  Enviar Minha Ideia
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewIdeaPage;
