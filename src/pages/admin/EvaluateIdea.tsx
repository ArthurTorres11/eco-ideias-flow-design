import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { useIdeas } from "@/contexts/IdeasContext";
import { toast } from "@/hooks/use-toast";

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="text-2xl hover:scale-110 transition-transform"
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function EvaluateIdea() {
  const { ideaId } = useParams();
  const { ideas, updateIdeaStatus } = useIdeas();
  const [idea, setIdea] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Buscar a ideia específica pelos dados reais
    const foundIdea = ideas.find(i => i.id === ideaId);
    if (foundIdea) {
      setIdea(foundIdea);
      setStatus(foundIdea.status);
    }
  }, [ideaId, ideas]);

  const handleSaveEvaluation = async () => {
    if (!status) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um status para a ideia.",
        variant: "destructive",
      });
      return;
    }

    const result = await updateIdeaStatus(ideaId!, status as any);
    
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: "Avaliação salva com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao salvar avaliação.",
        variant: "destructive",
      });
    }
  };

  if (!idea) {
    return (
      <div className="p-6">
        <p>Carregando ideia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Avaliação de Ideia</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Avaliar Ideia: {idea.title}
          </CardTitle>
          <p className="text-gray-600">Autor: {idea.author}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-gray-700 leading-relaxed">{idea.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-1">Categoria</h4>
              <p className="text-gray-600">{idea.category}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Data de Submissão</h4>
              <p className="text-gray-600">{idea.created_at}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Impacto Estimado</h4>
              <p className="text-gray-600">{idea.impact}</p>
            </div>
          </div>

          {idea.file_url && (
            <div>
              <h4 className="font-medium mb-2">Anexo</h4>
              <a 
                href={idea.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {idea.file_name || 'Arquivo anexado'}
              </a>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Avaliação</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  Status da Ideia
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aprovada">Aprovar</SelectItem>
                    <SelectItem value="Reprovada">Reprovar</SelectItem>
                    <SelectItem value="Em Análise">Manter em Análise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  Comentários
                </label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Adicione seus comentários sobre a avaliação..."
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSaveEvaluation}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Salvar Avaliação
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}