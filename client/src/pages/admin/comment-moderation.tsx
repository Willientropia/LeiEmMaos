import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, User, Calendar, MessageSquare } from "lucide-react";
import type { Comment } from "@shared/schema";

export default function CommentModeration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending comments
  const { data: pendingComments = [], isLoading } = useQuery({
    queryKey: ["/api/comments/pending"],
  });

  // Approve comment mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PUT", `/api/comments/${id}/approve`);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Comentário aprovado!" });
      queryClient.invalidateQueries({ queryKey: ["/api/comments/pending"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/comments/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Comentário rejeitado!" });
      queryClient.invalidateQueries({ queryKey: ["/api/comments/pending"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApproveComment = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleRejectComment = (id: string) => {
    if (confirm("Tem certeza que deseja rejeitar este comentário?")) {
      deleteMutation.mutate(id);
    }
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Moderação de Comentários</h1>
          <p className="text-neutral-600">
            Revisar e aprovar comentários antes de serem publicados.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <MessageSquare className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingComments.length}</div>
              <p className="text-xs text-muted-foreground">Aguardando moderação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados Hoje</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitados Hoje</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Comments */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : pendingComments.length > 0 ? (
          <div className="space-y-4">
            {pendingComments.map((comment: Comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <User size={16} className="text-neutral-500" />
                        <span className="font-medium text-neutral-900">{comment.name}</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pendente
                        </Badge>
                      </div>
                      
                      <p className="text-neutral-700 mb-3 leading-relaxed">
                        {comment.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-neutral-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(comment.createdAt!)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare size={14} />
                          <span>ID da Notícia: {comment.newsId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveComment(comment.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectComment(comment.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <XCircle size={14} className="mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Nenhum comentário pendente
              </h3>
              <p className="text-neutral-500">
                Todos os comentários foram revisados. Bom trabalho!
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
