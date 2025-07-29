import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Star, MapPin } from "lucide-react";
import { NEWS_CATEGORIES } from "@/lib/constants";
import type { News } from "@shared/schema";

const newsSchema = z.object({
  title: z.string().min(10, "Título deve ter pelo menos 10 caracteres"),
  content: z.string().min(50, "Conteúdo deve ter pelo menos 50 caracteres"),
  summary: z.string().min(20, "Resumo deve ter pelo menos 20 caracteres"),
  imageUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  category: z.string().min(1, "Selecione uma categoria"),
  state: z.string().optional(),
  municipality: z.string().optional(),
  featured: z.boolean().default(false),
  authorId: z.string().default("admin"), // TODO: Get from auth context
});

type NewsFormData = z.infer<typeof newsSchema>;

export default function NewsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      imageUrl: "",
      category: "",
      state: "",
      municipality: "",
      featured: false,
      authorId: "admin",
    },
  });

  // Fetch all news
  const { data: allNews = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  // Fetch states
  const { data: states = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/states"],
  });

  // Fetch municipalities
  const selectedState = form.watch("state");
  const { data: municipalities = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/states", selectedState, "municipalities"],
    enabled: !!selectedState,
  });

  // Create news mutation
  const createMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      return await apiRequest("POST", "/api/news", data);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Notícia criada com sucesso!" });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update news mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NewsFormData> }) => {
      return await apiRequest("PUT", `/api/news/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Notícia atualizada com sucesso!" });
      setIsDialogOpen(false);
      setEditingNews(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete news mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/news/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Notícia excluída com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    form.reset({
      title: news.title,
      content: news.content,
      summary: news.summary,
      imageUrl: news.imageUrl || "",
      category: news.category,
      state: news.state || "",
      municipality: news.municipality || "",
      featured: news.featured || false,
      authorId: news.authorId,
    });
    setIsDialogOpen(true);
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const onSubmit = (data: NewsFormData) => {
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id!, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteNews = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      deleteMutation.mutate(id);
    }
  };

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Gerenciar Notícias</h1>
            <p className="text-neutral-600">Criar, editar e publicar notícias da plataforma.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNews}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Notícia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNews ? "Editar Notícia" : "Criar Nova Notícia"}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título da notícia..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Resumo que aparecerá nos cards..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conteúdo completo da notícia..."
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {NEWS_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL da Imagem</FormLabel>
                          <FormControl>
                            <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado (Opcional)</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              const stateValue = value === "nacional" ? "" : value;
                              field.onChange(stateValue);
                              form.setValue("municipality", "");
                            }}
                            value={field.value || "nacional"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem key="nacional" value="nacional">Nacional</SelectItem>
                              {states.map((state: any) => (
                                <SelectItem key={state.id} value={state.id}>
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Município (Opcional)</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              const municipalityValue = value === "todo-estado" ? "" : value;
                              field.onChange(municipalityValue);
                            }}
                            value={field.value || "todo-estado"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o município" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem key="todo-estado" value="todo-estado">Todo o Estado</SelectItem>
                              {municipalities.map((municipality: any) => (
                                <SelectItem key={municipality.id || municipality.name} value={municipality.name}>
                                  {municipality.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Destaque</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Marcar como notícia em destaque na página inicial
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingNews ? "Atualizar" : "Criar"} Notícia
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* News List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : allNews.length > 0 ? (
          <div className="space-y-4">
            {allNews.map((news: News) => (
              <Card key={news.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={categoryColors[news.category] || "bg-gray-100 text-gray-800"}>
                          {news.category}
                        </Badge>
                        {news.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Star size={12} className="mr-1" />
                            Destaque
                          </Badge>
                        )}
                        {(news.state || news.municipality) && (
                          <div className="flex items-center text-neutral-500 text-xs">
                            <MapPin size={12} className="mr-1" />
                            <span>
                              {news.municipality && news.state 
                                ? `${news.municipality}, ${news.state}`
                                : news.state || "Nacional"
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        {news.title}
                      </h3>
                      <p className="text-neutral-600 text-sm line-clamp-2">
                        {news.summary}
                      </p>
                      <p className="text-neutral-500 text-xs mt-2">
                        Criado em {new Date(news.createdAt!).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditNews(news)}
                      >
                        <Edit size={14} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteNews(news.id!)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Excluir
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
              <p className="text-neutral-500">Nenhuma notícia encontrada. Crie a primeira notícia!</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
