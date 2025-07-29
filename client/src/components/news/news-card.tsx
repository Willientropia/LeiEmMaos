import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";

interface NewsCardProps {
  news: News;
  featured?: boolean;
}

export default function NewsCard({ news, featured = false }: NewsCardProps) {
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
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Agora";
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
    }
  };

  if (featured) {
    return (
      <Card className="news-card-hover overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {news.imageUrl && (
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-64 md:h-full object-cover" 
              />
            )}
          </div>
          <CardContent className="md:w-1/2 p-8">
            <div className="flex items-center space-x-2 mb-3">
              <Badge className={categoryColors[news.category] || "bg-gray-100 text-gray-800"}>
                {news.category}
              </Badge>
              <span className="text-neutral-500 text-sm">
                {formatDate(news.createdAt!)}
              </span>
            </div>
            <h4 className="text-2xl font-bold text-neutral-900 mb-4 leading-tight">
              {news.title}
            </h4>
            <p className="text-neutral-600 leading-relaxed mb-6">
              {news.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-neutral-500 text-sm">
                <MapPin size={16} />
                <span>
                  {news.municipality && news.state 
                    ? `${news.municipality}, ${news.state}`
                    : news.state || "Nacional"
                  }
                </span>
              </div>
              <Link href={`/news/${news.id}`}>
                <Button variant="ghost" className="text-primary hover:text-primary-dark">
                  Ler mais <ExternalLink size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="news-card-hover overflow-hidden">
      {news.imageUrl && (
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-48 object-cover" 
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={categoryColors[news.category] || "bg-gray-100 text-gray-800"}>
            {news.category}
          </Badge>
          <span className="text-neutral-500 text-sm">
            {formatDate(news.createdAt!)}
          </span>
        </div>
        <h5 className="text-lg font-semibold text-neutral-900 mb-3 leading-tight">
          {news.title}
        </h5>
        <p className="text-neutral-600 text-sm leading-relaxed mb-4">
          {news.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 text-sm flex items-center">
            <MapPin size={14} className="mr-1" />
            {news.municipality && news.state 
              ? `${news.municipality}, ${news.state}`
              : news.state || "Nacional"
            }
          </span>
          <Link href={`/news/${news.id}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
              Ler mais
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
