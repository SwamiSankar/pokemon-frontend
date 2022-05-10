import React, { useState, useEffect } from 'react';
import { assignColor } from '../utils/PokemonTypeColors';
import { axiosRequest } from '../apis/apis';
import StatBar from '../utils/StatBar';

const PokemonCard = ({ raw_data }) => {
  const [styles, setStyles] = useState({});
  const [pokemon, setPokemon] = useState({
    id: '',
    abilities: [],
    name: '',
    height: 0,
    weight: 0,
    types: [],
    stats: [],
    sprites: [],
  });

  const { sprites, types, stats } = pokemon;
  let hpObject,
    attackObject,
    defenseObject,
    speedObject = {};

  if (pokemon !== undefined && pokemon.stats.length > 0) {
    hpObject = {
      name: 'hp',
      base_stat: stats[0].base_stat,
    };

    attackObject = {
      name: 'attack',
      base_stat: pokemon.stats[1].base_stat,
    };

    defenseObject = {
      name: 'defense',
      base_stat: pokemon.stats[2].base_stat,
    };

    speedObject = {
      name: 'speed',
      base_stat: pokemon.stats[5].base_stat,
    };
  }

  const image_url = sprites.front_default;
  const card_gradient = (types) => {
    if (types.length === 1) {
      return {
        backgroundImage: `linear-gradient(${assignColor(
          types[0].type.name
        )}44,${assignColor(types[0].type.name)}ff)`,
      };
    } else {
      return {
        backgroundImage: `linear-gradient(40deg,${assignColor(
          types[0].type.name
        )} 30%,${assignColor(types[1].type.name)} 50%)`,
      };
    }
  };

  useEffect(() => {
    if (types !== undefined && types.length > 0)
      setStyles(card_gradient(types));
  }, [types]);

  useEffect(() => {
    const assignPokemon = async (url) => {
      const response = await axiosRequest.get(url);
      const data = response.data;

      setPokemon((prev) => ({
        ...prev,
        id: data.id,
        abilities: data.abilities,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types,
        stats: data.stats,
        sprites: data.sprites,
      }));
    };

    assignPokemon(raw_data.url);
  }, [raw_data]);

  return (
    <>
      {Object.keys(styles).length > 0 ? (
        <div className={`pokemon-card ${pokemon.name}`}>
          <div className="face pokemon-image" style={styles}>
            <img src={image_url} alt="Pokemon" />
          </div>

          <div className="face pokemon-content">
            <h3
              className="pokemon-title"
              style={{
                backgroundImage: styles.backgroundImage,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                //backgroundClip: 'text',
                color: 'transparent',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h3>
            {types.length === 2 ? (
              <div className="pokemon-types">
                {types.map((type, index) => (
                  <div
                    className={`pokemon-type ${type.type.name}`}
                    key={index}
                    style={{
                      color: assignColor(type.type.name),
                    }}
                  >
                    {type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="pokemon-pure-type">
                {types.map((type, index) => (
                  <div
                    className={`pokemon-type ${type.type.name}`}
                    key={index}
                    style={{
                      color: assignColor(type.type.name),
                    }}
                  >
                    {type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)}
                  </div>
                ))}{' '}
              </div>
            )}

            <div className="pokemon-height">Height : {pokemon.height}</div>
            <div className="pokemon-weight">Weight : {pokemon.weight}</div>
            <div className="stats-container">
              <div className="statbar hp">
                <label className="hp-label">HP</label>
                <StatBar percent={hpObject.base_stat} />
                <span className="hp-stat">{hpObject.base_stat}</span>
              </div>
              <div className="statbar attack">
                <label className="attack-label">Attack</label>
                <StatBar percent={attackObject.base_stat} />
                <span className="attack-stat">{attackObject.base_stat}</span>
              </div>
              <div className="statbar defense">
                <label className="defense-label">Defense</label>
                <StatBar percent={defenseObject.base_stat} />
                <span className="defense-stat">{defenseObject.base_stat}</span>
              </div>
              <div className="statbar speed">
                <label className="speed-label">Speed</label>
                <StatBar percent={speedObject.base_stat} />
                <span className="speed-stat">{speedObject.base_stat}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PokemonCard;
