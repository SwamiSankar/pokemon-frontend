import React, { useContext, useEffect, useMemo, useState } from 'react';
import { axiosRequest } from '../apis/apis';
import debounce from 'lodash.debounce';
import { AppContext } from '../../App';

const SearchBar = () => {
  const [rawArray, setRawArray] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  const { dispatch } = useContext(AppContext);

  const [inputText, setInputText] = useState('');
  useEffect(() => {
    axiosRequest('/pokemon?limit=100000').then((response) =>
      setRawArray(response.data.results)
    );
  }, []);

  const debouncedSave = useMemo(
    () => debounce((value) => setInputText(value), 1000),
    []
  );

  const filterPokemon = (arr, query) => {
    let filteredArray = [];
    if (query !== '') {
      filteredArray = arr.filter((pokemon) => {
        return pokemon.name.includes(query);
      });
    }

    return filteredArray;
  };

  useEffect(() => {
    const resultArray = filterPokemon(rawArray, inputText);

    setFilteredArray(resultArray);
  }, [inputText]);

  useEffect(() => {
    let pokemonObject = {};
    if (filteredArray.length > 0) {
      pokemonObject.filteredList = filteredArray;
      pokemonObject.isSearch = true;
      dispatch({ type: 'POKEMON_SEARCH', data: pokemonObject });
    } else if (filteredArray.length === 0 && inputText !== '') {
      pokemonObject.filteredList = [];
      pokemonObject.isSearch = true;
      dispatch({ type: 'POKEMON_SEARCH', data: pokemonObject });
    } else {
      pokemonObject.filteredList = [];
      pokemonObject.isSearch = false;
      dispatch({ type: 'POKEMON_SEARCH', data: pokemonObject });
    }
  }, [filteredArray]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  });

  return (
    <input
      className="searchInput"
      type="search"
      placeholder="Search for Pokemons..."
      onChange={(e) => {
        const value = e.target.value.toLowerCase();
        debouncedSave(value);
      }}
    />
  );
};

export default SearchBar;
