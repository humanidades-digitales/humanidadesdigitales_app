import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://humanidadesdigitales.pe:3000',
});

export default instance;
