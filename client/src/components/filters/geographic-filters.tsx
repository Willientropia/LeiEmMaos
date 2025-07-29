import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface GeographicFiltersProps {
  selectedState: string;
  selectedMunicipality: string;
  onStateChange: (state: string) => void;
  onMunicipalityChange: (municipality: string) => void;
  onApplyFilters: () => void;
}

export default function GeographicFilters({
  selectedState,
  selectedMunicipality,
  onStateChange,
  onMunicipalityChange,
  onApplyFilters,
}: GeographicFiltersProps) {
  // Fetch states
  const { data: states = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/states"],
  });

  // Fetch municipalities based on selected state
  const { data: municipalities = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/states", selectedState, "municipalities"],
    enabled: !!selectedState,
  });

  const handleStateChange = (value: string) => {
    onStateChange(value);
    onMunicipalityChange(""); // Reset municipality when state changes
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-white">Filtrar por Localização</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Select value={selectedState} onValueChange={handleStateChange}>
          <SelectTrigger className="bg-white text-neutral-900 border-0 focus:ring-2 focus:ring-yellow-300">
            <SelectValue placeholder="Selecione o Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">Todos os Estados</SelectItem>
            {states.map((state: any) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={selectedMunicipality} 
          onValueChange={onMunicipalityChange}
          disabled={!selectedState}
        >
          <SelectTrigger className="bg-white text-neutral-900 border-0 focus:ring-2 focus:ring-yellow-300">
            <SelectValue placeholder="Selecione o Município" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">Todos os Municípios</SelectItem>
            {municipalities.map((municipality: any) => (
              <SelectItem key={municipality.id || municipality.name} value={municipality.name}>
                {municipality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={onApplyFilters}
        className="mt-4 political-secondary text-white hover:bg-green-600 transition-colors font-medium"
      >
        <Search className="mr-2" size={16} />
        Filtrar Notícias
      </Button>
    </div>
  );
}
