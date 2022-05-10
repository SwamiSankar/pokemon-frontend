import React, { useReducer } from 'react';
import PokemonDisplayPage from './Components/Pages/PokemonDisplayPage';

export const AppContext = React.createContext();

const initialState = {
  searchData: {
    filteredList: [],
    isSearch: false,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'POKEMON_SEARCH':
      return {
        searchData: action.data,
      };
    default:
      return initialState;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <PokemonDisplayPage />
      </div>
    </AppContext.Provider>
  );
}

export default App;
