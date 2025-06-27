
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Droplet, 
  Bolt, 
  Lightbulb, 
  Recycle, 
  Leaf, 
  Award,
  Star,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";
import Header from "@/components/Header";

const DashboardPage = () => {
  const navigate = useNavigate();

  const ideas = [
    {
      id: 1,
      title: "Sistema de Captação de Água da Chuva",
      description: "Implementar sistema para reutilização da água da chuva nos escritórios.",
      status: "Aprovada",
      statusColor: "bg-green-100 text-green-800 border-green-200",
      category: "water",
      date: "15 Nov 2024",
      impact: "2.450L economia mensal"
    },
    {
      id: 2,
      title: "Programa de Carona Solidária",
      description: "Aplicativo interno para funcionários compartilharem caronas.",
      status: "Em Análise",
      statusColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
      category: "transport",
      date: "12 Nov 2024",
      impact: "Redução de 30% nas emissões"
    },
    {
      id: 3,
      title: "Compostagem nos Escritórios",
      description: "Criar pontos de compostagem para resíduos orgânicos.",
      status: "Aprovada",
      statusColor: "bg-green-100 text-green-800 border-green-200",
      category: "waste",
      date: "08 Nov 2024",
      impact: "80% redução resíduos orgânicos"
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water': return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'transport': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'waste': return <Recycle className="w-5 h-5 text-orange-500" />;
      default: return <Leaf className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "Aprovada" ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <Clock className="w-4 h-4 text-yellow-600" />;
  };

  const achievements = [
    { name: "Primeira Ideia", icon: <Star className="w-4 h-4" />, earned: true },
    { name: "Eco Inovador", icon: <Lightbulb className="w-4 h-4" />, earned: true },
    { name: "Impacto Verde", icon: <Leaf className="w-4 h-4" />, earned: false },
    { name: "Super Colaborador", icon: <Award className="w-4 h-4" />, earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header & Call to Action */}
        <section className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Bem-vindo, <span className="text-green-700">João Silva</span>!
            </h1>
            <p className="text-lg text-gray-600">
              Continue fazendo a diferença com suas ideias sustentáveis
            </p>
          </div>
          
          <div className="relative">
            <Button
              onClick={() => navigate("/new-idea")}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl px-12 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Lightbulb className="w-6 h-6 mr-3" />
              + Submeter Nova Ideia
            </Button>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Ideas Section */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-green-600" />
                Minhas Ideias
              </h2>
              <Badge variant="outline" className="text-green-700 border-green-200">
                {ideas.length} ideias
              </Badge>
            </div>

            <div className="space-y-4">
              {ideas.map((idea, index) => (
                <Card key={idea.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border">
                        {getCategoryIcon(idea.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {idea.title}
                          </h3>
                          <Badge className={`${idea.statusColor} border flex items-center gap-1`}>
                            {getStatusIcon(idea.status)}
                            {idea.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {idea.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{idea.date}</span>
                          <span className="text-green-600 font-medium">{idea.impact}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Personal Impact Panel */}
          <section className="space-y-6">
            {/* Impact Metrics */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Seu Impacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Water Impact */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-700">Água economizada</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">2.450L</span>
                  </div>
                  <Progress value={75} className="h-3 bg-blue-100" />
                  <p className="text-xs text-gray-500">75% da meta mensal</p>
                </div>

                {/* Energy Impact */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bolt className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-gray-700">Energia poupada</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">156 kWh</span>
                  </div>
                  <Progress value={60} className="h-3 bg-yellow-100" />
                  <p className="text-xs text-gray-500">60% da meta mensal</p>
                </div>

                {/* CO2 Reduction */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-700">CO₂ reduzido</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">89 kg</span>
                  </div>
                  <Progress value={45} className="h-3 bg-green-100" />
                  <p className="text-xs text-gray-500">45% da meta mensal</p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        achievement.earned
                          ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                          : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >
                      <div className="flex justify-center mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                        }`}>
                          {achievement.icon}
                        </div>
                      </div>
                      <p className="text-xs font-medium">{achievement.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-green-400">3</p>
                    <p className="text-sm text-gray-300">Ideias Aprovadas</p>
                  </div>
                  <div className="h-px bg-gray-700"></div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">92%</p>
                    <p className="text-sm text-gray-300">Taxa de Aprovação</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
