import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    // We are temporarily hardcoding the credentials to force a connection.
    url: "libsql://evenour-evenour.aws-ap-south-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTMyNjg2NTYsImlkIjoiYmQzNjFhY2EtZjg3ZS00ZjVkLTg1NzItN2Y3OWUwMmJkZjhiIiwicmlkIjoiYmE4ODY5M2UtYmU5Ni00N2ZjLTk2ZGEtY2Y5MWQwZDUwYTc5In0.k9ypowNmkh4-9i7Wh6Sq5cVckufsBBq1HyG2v9vxFDeM9DMAr5IsZoX4QEKBh_TGSSDvDSSL0rCUZegFIdwEBw"
  }
});