export interface PokemonListResult {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };

  types: {
    type: {
      name: string;
    };
  }[];
  weight: number;
  base_experience: number;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListResult[];
}
