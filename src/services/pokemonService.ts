import axios from "axios";
import type { Pokemon, PokemonListResponse } from "../types/pokemon";

const apiClient = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

export const fetchPokemonList = async (limit: number, offset: number) => {
  try {
    const listResponse = await apiClient.get<PokemonListResponse>(`pokemon`, {
      params: { limit, offset },
    });

    const { results, count } = listResponse.data;

    const pokemonPromises = results.map(async (p) => {
      const pokemonDetails = await axios.get<Pokemon>(p.url);
      return pokemonDetails.data;
    });

    const detailedPokemons = await Promise.all(pokemonPromises);

    return { pokemons: detailedPokemons, totalCount: count };
  } catch (error) {
    console.error("Error", error);
    return { pokemons: [], totalCount: 0 };
  }
};

export const fetchPokemonById = async (id: string): Promise<Pokemon | null> => {
  try {
    const response = await apiClient.get<Pokemon>(`pokemon/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
