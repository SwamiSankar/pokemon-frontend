import { useEffect, useState } from 'react';
import { axiosRequest } from '../Components/apis/apis';

const useInfiniteScroll = (offset, arr) => {
  console.log(offset);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isThere, setIsThere] = useState(false);
  const [pokemon, setPokemon] = useState({
    abilities: [],
    name: '',
    height: 0,
    weight: 0,
    types: [],
    stats: [],
    sprites: [],
  });
  const [pokemonList, setPokemonList] = useState([]);
  const [resultList, setResultList] = useState([]);

  const getPokemonList = async () => {
    return await axiosRequest.get(`/pokemon?offset=${offset}&limit=20`);
  };

  const assignPokemon = async (url) => {
    const response = await axiosRequest.get(url);
    const data = response.data;

    setPokemon((prev) => ({
      ...prev,
      abilities: data.abilities,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types: data.types,
      stats: data.stats,
      sprites: data.sprites,
    }));
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    const fetchPokemonList = async () => {
      try {
        const response = await getPokemonList();

        setLoading(false);
        setIsThere(response.data.next !== null);
        const pokeList = response.data.results;

        for (const poke in pokeList) {
          await assignPokemon(pokeList[poke].url.slice(25, 39));
        }
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    fetchPokemonList();
  }, [offset]);

  useEffect(() => {
    console.log('Pokemon has been updated');
    setPokemonList((prev) => [...prev, pokemon]);
  }, [pokemon]);

  if (pokemonList.length === 21) {
    pokemonList.shift();
  }

  setResultList(arr.concat(pokemonList));

  return { loading, error, isThere, resultList };
};

export default useInfiniteScroll;
