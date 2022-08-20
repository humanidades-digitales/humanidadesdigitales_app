import axios from 'axios';

console.log(process.env.NODE_ENV);

export const hdapi = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'http://humanidadesdigitales.pe:3000'
      : 'http://localhost:3000',
});

export const downloadUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://humanidadesdigitales.pe:3000'
    : 'http://localhost:3000';
