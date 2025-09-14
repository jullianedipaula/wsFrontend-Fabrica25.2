import { useEffect, useState } from 'react';
import { PokemonCard } from '../components/PokemonCard';
import { Input } from '@/components/ui/input';
import { fetchPokemonList } from '../services/pokemonService';
import type { Pokemon } from '../types/pokemon';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { Loader2 } from 'lucide-react'; 

const pokemonPerPage = 18;

export default function HomePage() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0); 
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadInitialPokemons = async () => {
      setIsLoading(true);
      const { pokemons, totalCount } = await fetchPokemonList(pokemonPerPage, 0);
      setAllPokemons(pokemons);
      setFilteredPokemons(pokemons);
      setTotalCount(totalCount);
      setOffset(pokemonPerPage);
      setIsLoading(false);
    };
    loadInitialPokemons();
  }, []);


  useEffect(() => {
    const results = allPokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemons(results);
  }, [searchTerm, allPokemons]);

  const handleLoadMore = async () => {
    if (isFetchingMore || allPokemons.length >= totalCount) return;

    setIsFetchingMore(true);
    const { pokemons } = await fetchPokemonList(pokemonPerPage, offset);
  
    setAllPokemons(prev => [...prev, ...pokemons]);
    setFilteredPokemons(prev => [...prev, ...pokemons]);
    
    setOffset(prev => prev + pokemonPerPage);
    setIsFetchingMore(false);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <Input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="max-w-md w-full"
        />
        <ToggleGroup 
          type="single" 
          value={viewMode}
          onValueChange={(value) => { if (value) setViewMode(value as 'grid' | 'list')}}
          defaultValue="grid"
        >
          <ToggleGroupItem value="grid" aria-label="Toggle grid"><Grid3x3 className="h-16 w-16" /></ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Toggle list"><List className="h-16 w-16" /></ToggleGroupItem>
        </ToggleGroup>
      </div>


      {isLoading ? (
        <p className="text-center text-xl">Loading...</p>
      ) : (
        <>
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "flex flex-col gap-4 max-w-4xl mx-auto"
          }>
            {filteredPokemons.length > 0 ? (
              filteredPokemons.map(pokemon => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} view={viewMode} />
              ))
            ) : (
              <p className="col-span-full text-center text-xl">Nenhum Pokémon encontrado.</p>
            )}
          </div>

          {allPokemons.length < totalCount && !searchTerm && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleLoadMore} disabled={isFetchingMore}>
                {isFetchingMore ? (
                  <>
                    <Loader2 className="mr-2 h-7 w-7 animate-spin" />
                   Loading
                  </>
                ) : (
                  "Carregar Mais"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}