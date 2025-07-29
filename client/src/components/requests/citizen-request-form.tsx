import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { REQUEST_TYPES } from "@/lib/constants";
import { Send } from "lucide-react";

const requestSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  state: z.string().min(1, "Selecione um estado"),
  municipality: z.string().min(1, "Selecione um município"),
  type: z.string().min(1, "Selecione o tipo de solicitação"),
  message: z.string().min(50, "A solicitação deve ter pelo menos 50 caracteres"),
  acceptedTerms: z.boolean().refine(val => val === true, "Você deve aceitar os termos"),
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function CitizenRequestForm() {
  const { toast } = useToast();
  
  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: "",
      email: "",
      state: "",
      municipality: "",
      type: "",
      message: "",
      acceptedTerms: false,
    },
  });

  const selectedState = form.watch("state");

  // Fetch states
  const { data: states = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/states"],
  });

  // Fetch municipalities based on selected state
  const { data: municipalities = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/states", selectedState, "municipalities"],
    enabled: !!selectedState,
  });

  const mutation = useMutation({
    mutationFn: async (data: Omit<RequestFormData, "acceptedTerms">) => {
      return await apiRequest("POST", "/api/requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação foi enviada com sucesso e será direcionada aos políticos da sua região.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestFormData) => {
    const { acceptedTerms, ...requestData } = data;
    mutation.mutate(requestData);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-neutral-900 mb-4">
          Envie sua Solicitação
        </CardTitle>
        <p className="text-neutral-600 text-lg">
          Conecte-se diretamente com os políticos da sua região. Suas solicitações serão direcionadas automaticamente.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("municipality", ""); // Reset municipality when state changes
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormLabel>Município</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu município" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

            {/* Request Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Solicitação</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REQUEST_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua Solicitação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva sua solicitação detalhadamente..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-neutral-500 text-sm">Mínimo de 50 caracteres</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Privacy Notice */}
            <div className="bg-neutral-50 p-4 rounded-lg">
              <FormField
                control={form.control}
                name="acceptedTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Concordo com o processamento dos meus dados para fins de direcionamento da solicitação aos representantes políticos competentes.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="px-8 py-4 text-lg shadow-lg hover:shadow-xl"
              >
                <Send className="mr-2" size={20} />
                {mutation.isPending ? "Enviando..." : "Enviar Solicitação"}
              </Button>
              <p className="text-neutral-500 text-sm mt-3">
                Sua solicitação será direcionada automaticamente aos políticos da sua região
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
