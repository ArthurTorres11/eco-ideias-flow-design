
import { useState } from "react";
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

const ideaDetails = {
  id: 1,
  titulo: "Sistema de captação de água da chuva",
  autor: "Maria Silva",
  descricao: "Proposta para implementar um sistema de captação e armazenamento de água da chuva nos telhados dos prédios da empresa. O sistema incluiria calhas especiais, filtros e reservatórios para coleta e tratamento básico da água, que seria utilizada para irrigação das áreas verdes e limpeza geral. Estimativa de economia de 30% no consumo de água potável.",
  categoria: "Água",
  dataSubmissao: "2024-01-15",
  anexos: ["projeto-captacao.pdf", "orcamento-inicial.xlsx"]
};

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
  const [impactoAmbiental, setImpactoAmbiental] = useState(0);
  const [viabilidadeTecnica, setViabilidadeTecnica] = useState(0);
  const [custoBeneficio, setCustoBeneficio] = useState(0);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSaveEvaluation = () => {
    console.log("Saving evaluation:", {
      ideaId,
      impactoAmbiental,
      viabilidadeTecnica,
      custoBeneficio,
      status,
      feedback
    });
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Avaliação de Ideia</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Idea Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Ideia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Título</h3>
              <p className="text-gray-700">{ideaDetails.titulo}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Autor</h3>
              <p className="text-gray-700">{ideaDetails.autor}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descrição Completa</h3>
              <p className="text-gray-700 leading-relaxed">{ideaDetails.descricao}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Anexos</h3>
              <div className="space-y-2">
                {ideaDetails.anexos.map((anexo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      📎 {anexo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Evaluation Scorecard */}
        <Card>
          <CardHeader>
            <CardTitle>Scorecard de Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-900">Impacto Ambiental</label>
                <StarRating rating={impactoAmbiental} onRatingChange={setImpactoAmbiental} />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-900">Viabilidade Técnica</label>
                <StarRating rating={viabilidadeTecnica} onRatingChange={setViabilidadeTecnica} />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-900">Custo-Benefício</label>
                <StarRating rating={custoBeneficio} onRatingChange={setCustoBeneficio} />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Status da Ideia
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aprovar">Aprovar</SelectItem>
                  <SelectItem value="reprovar">Reprovar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Feedback para o Colaborador
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escreva seu feedback detalhado aqui..."
                rows={4}
              />
            </div>

            <Button
              onClick={handleSaveEvaluation}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Salvar Avaliação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
