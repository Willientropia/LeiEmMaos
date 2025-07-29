import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CommentForm from "@/components/news/comment-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, User } from "lucide-react";
import type { Comment } from "@shared/schema";

export default function NewsDetail() {
  const [, params] = useRoute("/news/:id");
  const newsId = params?.id;

  // Fetch news article
  const { data: news, isLoading: newsLoading } = useQuery<News>({
    queryKey: ["/api/news", newsId],
    enabled: !!newsId,
  });

  // Fetch approved comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["/api/news", newsId, "comments", { approved: "true" }],
    enabled: !!newsId,
  });

  if (newsLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-neutral-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-neutral-900 mb-4">Notícia não encontrada</h1>
              <p className="text-neutral-600">A notícia que você está procurando não existe ou foi removida.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    "URGENTE": "bg-red-100 text-red-800",
    "ELEIÇÕES": "bg-blue-100 text-blue-800",
    "MUNICIPAL": "bg-green-100 text-green-800",
    "ESTADUAL": "bg-yellow-100 text-yellow-800",
    "FEDERAL": "bg-purple-100 text-purple-800",
    "CONGRESSO": "bg-indigo-100 text-indigo-800",
    "SENADO": "bg-pink-100 text-pink-800",
    "CÂMARA": "bg-orange-100 text-orange-800",
    "STF": "bg-gray-100 text-gray-800",
    "POLÍTICA": "bg-cyan-100 text-cyan-800",
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge className={categoryColors[news.category] || "bg-gray-100 text-gray-800"}>
                {news.category}
              </Badge>
              <div className="flex items-center text-neutral-500 text-sm space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formatDate(news.createdAt!)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>
                    {news.municipality && news.state 
                      ? `${news.municipality}, ${news.state}`
                      : news.state || "Nacional"
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-neutral-900 leading-tight mb-4">
              {news.title}
            </h1>
            
            <p className="text-xl text-neutral-600 leading-relaxed">
              {news.summary}
            </p>
          </div>

          {/* Article Image */}
          {news.imageUrl && (
            <div className="mb-8">
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
              />
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-8">
            <Separator />
            
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Comentários ({comments.length})
              </h2>
              
              {commentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                      <div className="h-16 bg-neutral-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-6 mb-8">
                  {comments.map((comment: Comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <User size={16} className="text-neutral-500" />
                          <span className="font-medium text-neutral-900">{comment.name}</span>
                          <span className="text-neutral-500 text-sm">•</span>
                          <span className="text-neutral-500 text-sm">
                            {formatDate(comment.createdAt!)}
                          </span>
                        </div>
                        <p className="text-neutral-700">{comment.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="mb-8">
                  <CardContent className="p-6 text-center">
                    <p className="text-neutral-500">
                      Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Comment Form */}
            <CommentForm newsId={newsId!} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
