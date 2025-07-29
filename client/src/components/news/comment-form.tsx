import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const commentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  content: z.string().min(10, "Comentário deve ter pelo menos 10 caracteres"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  newsId: string;
}

export default function CommentForm({ newsId }: CommentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      return await apiRequest("POST", `/api/news/${newsId}/comments`, data);
    },
    onSuccess: () => {
      toast({
        title: "Comentário enviado!",
        description: "Seu comentário está pendente de aprovação e será publicado em breve.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/news", newsId, "comments"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar comentário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CommentFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deixe seu comentário</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
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
                  <FormLabel>Comentário</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escreva seu comentário..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Enviando..." : "Enviar Comentário"}
            </Button>
          </form>
        </Form>
        
        <p className="text-neutral-500 text-sm mt-4">
          Todos os comentários passam por moderação antes de serem publicados.
        </p>
      </CardContent>
    </Card>
  );
}
