import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  MessageSquare, 
  Users, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Comment } from "@shared/schema";

export default function AdminDashboard() {
  // Fetch statistics
  const { data: stats, isLoading } = useQuery<{
    newsCount: number;
    requestsCount: number;
    responseRate: number;
  }>({
    queryKey: ["/api/stats"],
  });

  // Fetch pending comments count
  const { data: pendingComments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/comments/pending"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-neutral-600">Gerencie notícias, comentários e monitore as estatísticas da plataforma.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.newsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Publicadas na plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comentários Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingComments.length}</div>
              <p className="text-xs text-muted-foreground">Aguardando moderação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitações</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.requestsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Enviadas por cidadãos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.responseRate || 0}%</div>
              <p className="text-xs text-muted-foreground">Solicitações respondidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5" />
                <span>Gerenciar Notícias</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                Criar, editar e publicar notícias. Defina as que aparecerão em destaque na página inicial.
              </p>
              <Link href="/admin/news">
                <Button className="w-full">
                  Ir para Notícias
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Moderar Comentários</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                Aprovar ou rejeitar comentários dos usuários. 
                {pendingComments.length > 0 && (
                  <span className="text-yellow-600 font-medium">
                    {` ${pendingComments.length} pendente${pendingComments.length > 1 ? 's' : ''}.`}
                  </span>
                )}
              </p>
              <Link href="/admin/comments">
                <Button className="w-full" variant={pendingComments.length > 0 ? "default" : "outline"}>
                  {pendingComments.length > 0 ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Revisar Comentários
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Ver Comentários
                    </>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Usuários</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                Gerenciar usuários da plataforma, incluindo administradores e políticos cadastrados.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-500 text-center py-8">
              Sistema de auditoria em desenvolvimento. 
              Em breve você poderá acompanhar todas as ações administrativas realizadas na plataforma.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
