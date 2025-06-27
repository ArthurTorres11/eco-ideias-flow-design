
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

const usersData = [
  {
    id: 1,
    nome: "Maria Silva",
    email: "maria.silva@empresa.com",
    cpf: "123.456.789-00",
    perfil: "ROLE_COLABORADOR"
  },
  {
    id: 2,
    nome: "João Santos",
    email: "joao.santos@empresa.com",
    cpf: "987.654.321-00",
    perfil: "ROLE_GESTOR"
  },
  {
    id: 3,
    nome: "Ana Costa",
    email: "ana.costa@empresa.com",
    cpf: "456.789.123-00",
    perfil: "ROLE_COLABORADOR"
  },
  {
    id: 4,
    nome: "Carlos Lima",
    email: "carlos.lima@empresa.com",
    cpf: "789.123.456-00",
    perfil: "ROLE_COLABORADOR"
  },
];

export default function ManageUsers() {
  const navigate = useNavigate();

  const handleNewUser = () => {
    navigate("/admin/users/new");
  };

  const handleEditUser = (userId: number) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleDeleteUser = (userId: number) => {
    console.log("Delete user:", userId);
    // Here you would typically show a confirmation dialog and delete from backend
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
        <Button
          onClick={handleNewUser}
          className="bg-green-600 hover:bg-green-700"
        >
          + Novo Colaborador
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Perfil (Role)</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cpf}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.perfil === "ROLE_GESTOR" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.perfil}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
