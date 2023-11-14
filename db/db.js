import pg from "pg";

// old pool
const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: "postgres",
      password: "postgres",
      host: "localhost",
      port: "5432",
      database: "spiceup",
    };

const pool = new Pool(poolConfig);
export default pool;
