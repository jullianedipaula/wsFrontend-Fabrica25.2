import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Pokemon } from "@/types/pokemon";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: Pokemon;
  view: "grid" | "list";
}

const formatPokemonId = (id: number) => `#${String(id).padStart(3, "0")}`;

export function PokemonCard({ pokemon, view }: PokemonCardProps) {
  if (!pokemon.sprites.other["official-artwork"].front_default) return null;

  return (
    <Link to={`/detalhes/${pokemon.id}`}>
      <Card
        className={cn(
          "transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer",
          view === "list" && "flex flex-row items-center"
        )}
      >
        <CardHeader className="flex items-center justify-center p-2">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className={cn(
              "object-contain",
              view === "grid" ? "h-32 w-32" : "h-20 w-20"
            )}
          />
        </CardHeader>
        <CardContent
          className={cn(
            "p-4 pt-2",
            view === "grid" ? "text-center" : "text-left"
          )}
        >
          <p className="text-sm text-gray-500">{formatPokemonId(pokemon.id)}</p>
          <CardTitle className="text-lg capitalize">{pokemon.name}</CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
