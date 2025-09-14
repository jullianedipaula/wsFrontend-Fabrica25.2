import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPokemonById } from "../services/pokemonService";
import type { Pokemon } from "../types/pokemon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatPokemonId = (id: number) => `#${String(id).padStart(3, "0")}`;

export function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadPokemon = async () => {
      setIsLoading(true);
      const pokemonData = await fetchPokemonById(id);
      setPokemon(pokemonData);
      setIsLoading(false);
    };
    loadPokemon();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-10">Loading</div>;
  }

  if (!pokemon) {
    return <div className="text-center py-10">Pokémon não encontrado.</div>;
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Link>
      </Button>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-48 h-48 flex items-center justify-center mx-auto"
          />
          <p className="text-lg text-gray-500 flex items-center justify-center">
            {formatPokemonId(pokemon.id)}
          </p>
          <CardTitle className="text-4xl capitalize flex items-center justify-center">
            {pokemon.name}
          </CardTitle>
          <div className="flex gap-2 pt-2 items-center justify-center">
            {pokemon.types.map((t) => (
              <Badge key={t.type.name} variant="default">
                {t.type.name}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="">
              <p className="font-bold text-lg">Peso</p>
              <p>{pokemon.weight / 10} kg</p>
            </div>
            <div className="">
              <p className="font-bold text-lg">Experiência Base</p>
              <p>{pokemon.base_experience} XP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
