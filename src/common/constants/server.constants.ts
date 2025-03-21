import dotenv from 'dotenv';

dotenv.config();

export const POSTGRES_BD_CONFIG = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
    ssl: false
}

export const EXTERNALS_ENV = {
    googleApiUrl: process.env.GOOGLE_MAPS_API_KEY,
    googleToken : process.env.API_KEY_GOOGLE
}

console.log(POSTGRES_BD_CONFIG);
