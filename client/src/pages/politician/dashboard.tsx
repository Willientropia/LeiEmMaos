import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  TrendingUp
} from "lucide-react";
import type { Request } from "@shared/schema";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  resolved: CheckCircle,
  rejected: XCircle,
};

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em Andamento",
  resolved: "Resolvido",
  rejected: "Rejeitado",
};

const typeLabels = {
  infraestrutura: "Infraestrutura",
  saude: "Saúde",
  educacao: "Educação",
  seguranca: "Segurança",
  "meio-ambiente": "Meio Ambiente",
  outro: "Outro",
};

export default function PoliticianDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // TODO: Get politician info from auth context
  // For now, we'll use sample politician data
  const politicianState = "SP"; // This should come from auth
  const politicianMunicipality = "São Paulo"; // This should come from auth

  // Fetch requests for politician's region
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["/api/requests", { state: politicianState, municipality: politicianMunicipality }],
  });

  // Update request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, response }: { id: string; status: string; response?: string }) => {
      return await apiRequest("PUT", `/api/requests/${id}/status`, { status, response });
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Status da solicitação atualizado!" });
      setIsResponseDialogOpen(false);
      setSelectedRequest(null);
      setResponseText("");
      setSelectedStatus("");
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenResponseDialog = (request: Request) => {
    setSelectedRequest(request);
    setResponseText(request.response || "");
    setSelectedStatus(request.status || "pending");
    setIsResponseDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedRequest) return;
    
    updateStatusMutation.mutate({
      id: selectedRequest.id,
      status: selectedStatus,
      response: responseText.trim() || undefined,
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r: Request) => r.status === "pending").length,
    inProgress: requests.filter((r: Request) => r.status === "in_progress").length,
    resolved: requests.filter((r: Request) => r.status === "resolved").length,
    responseRate: requests.length > 0 
      ? Math.round((requests.filter((r: Request) => r.status === "resolved").length / requests.length) * 100)
      : 0,
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Portal do Político</h1>
          <p className="text-neutral-600">
            Gerencie as solicitações dos cidadãos da sua região: {politicianMunicipality}, {politicianState}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Solicitações recebidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Aguardando resposta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Sendo processadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Resposta</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responseRate}%</div>
              <p className="text-xs text-muted-foreground">Solicitações atendidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações dos Cidadãos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-neutral-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request: Request) => {
                  const StatusIcon = statusIcons[request.status as keyof typeof statusIcons];
                  
                  return (
                    <Card key={request.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                              <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                                <StatusIcon size={12} className="mr-1" />
                                {statusLabels[request.status as keyof typeof statusLabels]}
                              </Badge>
                              <Badge variant="outline">
                                {typeLabels[request.type as keyof typeof typeLabels]}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-neutral-500 text-sm mb-3">
                              <div className="flex items-center space-x-1">
                                <User size={14} />
                                <span>{request.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{formatDate(request.createdAt!)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin size={14} />
                                <span>{request.municipality}, {request.state}</span>
                              </div>
                            </div>
                            
                            <p className="text-neutral-700 mb-3 leading-relaxed">
                              {request.message}
                            </p>
                            
                            {request.response && (
                              <div className="bg-blue-50 p-3 rounded-lg mt-3">
                                <p className="text-sm font-medium text-blue-900 mb-1">Sua Resposta:</p>
                                <p className="text-blue-800 text-sm">{request.response}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Dialog open={isResponseDialogOpen && selectedRequest?.id === request.id} onOpenChange={setIsResponseDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenResponseDialog(request)}
                                >
                                  <MessageSquare size={14} className="mr-1" />
                                  {request.response ? "Atualizar" : "Responder"}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Responder Solicitação</DialogTitle>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="bg-neutral-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-neutral-900 mb-2">Solicitação:</p>
                                    <p className="text-neutral-700">{selectedRequest?.message}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                      Status da Solicitação
                                    </label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                                        <SelectItem value="resolved">Resolvido</SelectItem>
                                        <SelectItem value="rejected">Rejeitado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                      Resposta ao Cidadão (Opcional)
                                    </label>
                                    <Textarea
                                      placeholder="Digite sua resposta para o cidadão..."
                                      value={responseText}
                                      onChange={(e) => setResponseText(e.target.value)}
                                      className="min-h-[120px]"
                                    />
                                  </div>
                                  
                                  <div className="flex gap-2 pt-4">
                                    <Button 
                                      onClick={handleUpdateStatus}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      {updateStatusMutation.isPending ? "Salvando..." : "Salvar"}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setIsResponseDialogOpen(false)}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="text-neutral-500">
                  Não há solicitações dos cidadãos para sua região no momento.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
