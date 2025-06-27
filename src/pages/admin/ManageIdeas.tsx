
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ideasData = [
  {
    id: 1,
    titulo: "Sistema de captação de água da chuva",
    autor: "Maria Silva",
    categoria: "Água",
    dataSubmissao: "2024-01-15",
    status: "EM ANÁLISE"
  },
  {
    id: 2,
    titulo: "Iluminação LED automática",
    autor: "João Santos",
    categoria: "Energia",
    dataSubmissao: "2024-01-14",
    status: "APROVADA"
  },
  {
    id: 3,
    titulo: "Compostagem orgânica",
    autor: "Ana Costa",
    categoria: "Resíduos",
    dataSubmissao: "2024-01-13",
    status: "EM ANÁLISE"
  },
  {
    id: 4,
    titulo: "Painéis solares no telhado",
    autor: "Carlos Lima",
    categoria: "Energia",
    dataSubmissao: "2024-01-12",
    status: "REPROVADA"
  },
];

const statusColors = {
  "EM ANÁLISE": "bg-yellow-100 text-yellow-800",
  "APROVADA": "bg-green-100 text-green-800",
  "REPROVADA": "bg-red-100 text-red-800",
};

export default function ManageIdeas() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredIdeas = ideasData.filter((idea) => {
    return (statusFilter === "all" || idea.status === statusFilter) &&
           (categoryFilter === "all" || idea.categoria === categoryFilter);
  });

  const handleEvaluate = (ideaId: number) => {
    navigate(`/admin/ideas/${ideaId}/evaluate`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Ideias</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Todas as Ideias</CardTitle>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="EM ANÁLISE">Em Análise</SelectItem>
                  <SelectItem value="APROVADA">Aprovada</SelectItem>
                  <SelectItem value="REPROVADA">Reprovada</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="Energia">Energia</SelectItem>
                  <SelectItem value="Água">Água</SelectItem>
                  <SelectItem value="Resíduos">Resíduos</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data de Submissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIdeas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell>{idea.id}</TableCell>
                  <TableCell className="font-medium">{idea.titulo}</TableCell>
                  <TableCell>{idea.autor}</TableCell>
                  <TableCell>{idea.categoria}</TableCell>
                  <TableCell>{new Date(idea.dataSubmissao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[idea.status as keyof typeof statusColors]}`}>
                      {idea.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEvaluate(idea.id)}
                    >
                      Avaliar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
