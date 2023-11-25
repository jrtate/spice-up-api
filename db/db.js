import pg from "pg";

// old pool
const { Pool } = pg;

const poolConfig =
  process.env.NODE_ENV === "development"
    ? {
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5432",
        database: "spiceup",
      }
    : {
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
      };

const pool = new Pool(poolConfig);

export default pool;
