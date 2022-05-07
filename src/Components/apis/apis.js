import axios from 'axios';

export const axiosRequest = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
});
