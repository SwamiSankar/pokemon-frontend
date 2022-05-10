import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppContext } from '../../App';
import { axiosRequest } from '../apis/apis';

import PokemonCard from '../Cards/PokemonCard';
import Loader from '../utils/Loader';
import SearchBar from '../utils/SearchBar';

const PokemonDisplayPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isThere, setIsThere] = useState(false);
  const [offset, setOffset] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);

  const { state } = useContext(AppContext);
  const { isSearch, filteredList } = state.searchData;

  const observer = useRef();

  const lastElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && isThere) {
          setOffset((prevOffset) => prevOffset + 20);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isThere]
  );

  const getPokemonList = async (offset) => {
    return await axiosRequest.get(`/pokemon?offset=${offset}&limit=20`);
  };

  useEffect(() => {
    setLoading(true);
    setError(false);

    const fetchPokemonList = async () => {
      try {
        const response = await getPokemonList(offset);

        setLoading(false);
        setIsThere(response.data.next !== null);

        setPokemonList((prev) => [...prev, ...response.data.results]);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    fetchPokemonList();
  }, [offset]);

  useEffect(() => {}, [state]);

  return (
    <>
      <div>{loading ? <Loader /> : null}</div>
      <div> {error && 'Error ...'}</div>
      <SearchBar />
      <div className="pokemon-page-container">
        {isSearch
          ? filteredList.map((searchPoke, index) => {
              return (
                <div key={index}>
                  <PokemonCard raw_data={searchPoke} />
                </div>
              );
            })
          : pokemonList.map((poke, index) => {
              if (pokemonList.length === index + 1) {
                return (
                  <div key={index} ref={lastElement}>
                    <PokemonCard raw_data={poke} />
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <PokemonCard raw_data={poke} />
                  </div>
                );
              }
            })}
      </div>
    </>
  );
};

export default PokemonDisplayPage;
