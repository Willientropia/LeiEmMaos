import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import NewsCard from "@/components/news/news-card";
import CitizenRequestForm from "@/components/requests/citizen-request-form";
import GeographicFilters from "@/components/filters/geographic-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { News } from "@shared/schema";

export default function Home() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{ state?: string; municipality?: string }>({});

  // Fetch featured news
  const { data: featuredNews = [], isLoading: featuredLoading } = useQuery<News[]>({
    queryKey: ["/api/news?featured=true"],
  });

  // Fetch filtered news
  const queryParams = new URLSearchParams(appliedFilters).toString();
  const { data: filteredNews = [], isLoading: newsLoading } = useQuery<News[]>({
    queryKey: [`/api/news?${queryParams}`],
    enabled: Object.keys(appliedFilters).length > 0,
  });

  // Fetch statistics
  const { data: stats } = useQuery<{
    newsCount: number;
    requestsCount: number;
    politiciansCount: number;
    responseRate: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const handleStateChange = (state: string) => {
    const stateValue = state === "all" ? "" : state;
    setSelectedState(stateValue);
    setSelectedMunicipality("");
  };

  const handleMunicipalityChange = (municipality: string) => {
    const municipalityValue = municipality === "all" ? "" : municipality;
    setSelectedMunicipality(municipalityValue);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...(selectedState && { state: selectedState }),
      ...(selectedMunicipality && { municipality: selectedMunicipality }),
    });
  };

  const displayNews = Object.keys(appliedFilters).length > 0 ? filteredNews : featuredNews;
  const isLoadingNews = Object.keys(appliedFilters).length > 0 ? newsLoading : featuredLoading;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Conectando Cidadãos e <span className="text-yellow-300">Políticos</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Acompanhe as notícias políticas do Brasil e envie suas solicitações diretamente aos representantes da sua região.
            </p>
            
            <GeographicFilters
              selectedState={selectedState}
              selectedMunicipality={selectedMunicipality}
              onStateChange={handleStateChange}
              onMunicipalityChange={handleMunicipalityChange}
              onApplyFilters={handleApplyFilters}
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 py-12">
        {/* Featured News Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-neutral-900">
              {Object.keys(appliedFilters).length > 0 ? "Notícias Filtradas" : "Notícias em Destaque"}
            </h3>
            <Button variant="ghost" className="text-primary hover:text-primary-dark font-medium">
              Ver todas <ArrowRight className="ml-1" size={16} />
            </Button>
          </div>

          {isLoadingNews ? (
            <div className="space-y-6">
              <div className="h-64 bg-neutral-200 animate-pulse rounded-xl"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-neutral-200 animate-pulse rounded-xl"></div>
                ))}
              </div>
            </div>
          ) : displayNews.length > 0 ? (
            <>
              {/* Main Featured Article */}
              {displayNews[0] && (
                <div className="mb-8">
                  <NewsCard news={displayNews[0]} featured />
                </div>
              )}

              {/* News Grid */}
              {displayNews.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayNews.slice(1).map((news: News) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-neutral-500">
                  {Object.keys(appliedFilters).length > 0 
                    ? "Nenhuma notícia encontrada para os filtros selecionados."
                    : "Nenhuma notícia em destaque no momento."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Citizen Request Form */}
        <section className="mb-16">
          <CitizenRequestForm />
        </section>

        {/* Statistics Section */}
        {stats && (
          <section className="hero-gradient rounded-xl text-white p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Transparência em Números</h3>
              <p className="text-blue-100">O impacto da nossa plataforma na democracia brasileira</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.newsCount.toLocaleString()}</div>
                <div className="text-blue-100">Notícias Publicadas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.requestsCount.toLocaleString()}</div>
                <div className="text-blue-100">Solicitações Enviadas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.politiciansCount.toLocaleString()}</div>
                <div className="text-blue-100">Políticos Cadastrados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.responseRate}%</div>
                <div className="text-blue-100">Taxa de Resposta</div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
