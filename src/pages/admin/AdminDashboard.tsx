
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const kpiData = [
  { title: "Ideias Pendentes de Análise", value: "12", change: "+3 hoje" },
  { title: "Total de Ideias Aprovadas", value: "47", change: "+5 este mês" },
  { title: "Novos Usuários (Mês)", value: "23", change: "+15%" },
  { title: "Taxa de Engajamento", value: "68%", change: "+2.3%" },
];

const chartData = [
  { categoria: "Energia", ideias: 15 },
  { categoria: "Água", ideias: 12 },
  { categoria: "Resíduos", ideias: 8 },
  { categoria: "Transporte", ideias: 6 },
  { categoria: "Outros", ideias: 4 },
];

const recentIdeas = [
  { id: 1, titulo: "Sistema de captação de água da chuva", autor: "Maria Silva" },
  { id: 2, titulo: "Iluminação LED automática", autor: "João Santos" },
  { id: 3, titulo: "Compostagem orgânica", autor: "Ana Costa" },
  { id: 4, titulo: "Painéis solares no telhado", autor: "Carlos Lima" },
  { id: 5, titulo: "Reciclagem de papel", autor: "Lucia Ferreira" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              <p className="text-xs text-gray-500 mt-1">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Ideias por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ideias" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Ideas Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Últimas 5 Ideias Submetidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIdeas.map((idea) => (
                  <TableRow key={idea.id}>
                    <TableCell className="font-medium">{idea.titulo}</TableCell>
                    <TableCell>{idea.autor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
