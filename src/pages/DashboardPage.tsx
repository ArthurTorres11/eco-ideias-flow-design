
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet, Bolt } from "lucide-react";
import Header from "@/components/Header";

const DashboardPage = () => {
  const navigate = useNavigate();

  const ideas = [
    {
      id: 1,
      title: "Sistema de Captação de Água da Chuva",
      description: "Implementar sistema para reutilização da água da chuva nos escritórios.",
      status: "Aprovada",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      title: "Programa de Carona Solidária",
      description: "Aplicativo interno para funcionários compartilharem caronas.",
      status: "Em Análise",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: 3,
      title: "Compostagem nos Escritórios",
      description: "Criar pontos de compostagem para resíduos orgânicos.",
      status: "Aprovada",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto p-6">
        {/* New Idea Button */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/new-idea")}
            className="eco-green-dark hover:bg-green-800 text-white text-lg px-8 py-6 h-auto"
            size="lg"
          >
            + Submeter Nova Ideia
          </Button>
        </div>

        {/* My Ideas Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Minhas Ideias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <Badge className={idea.statusColor}>
                      {idea.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{idea.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Impacto das Suas Ideias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="eco-green-light border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 eco-green rounded-full flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Água economizada</h3>
                    <p className="text-2xl font-bold text-green-700">2.450L</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-green-light border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 eco-green rounded-full flex items-center justify-center">
                    <Bolt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Energia poupada</h3>
                    <p className="text-2xl font-bold text-green-700">156 kWh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
