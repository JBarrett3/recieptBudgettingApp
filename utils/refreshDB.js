import { Client } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recreateDatabase(DB_NAME, verbose=false) {
  // Connect to default database to drop and create DB
  const adminClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "postgres", // must connect to a DB other than the one to be dropped
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await adminClient.connect();

    if (verbose) console.log(`Dropping database ${DB_NAME} if exists...`);
    await adminClient.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);

    if (verbose) console.log(`Creating database ${DB_NAME}...`);
    await adminClient.query(`CREATE DATABASE ${DB_NAME};`);

    if (verbose) console.log(`Database ${DB_NAME} (re)created.`);
  } catch (err) {
    if (verbose) console.error('Error during DB drop/create:', err);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // Connect to the newly created DB and run schema.sql
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();

    if (verbose) console.log(__dirname)
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, { encoding: 'utf-8' });

    if (verbose) console.log(`Running schema.sql to create tables...`);
    await client.query(schemaSQL);

    if (verbose) console.log('Tables created successfully.');
  } catch (err) {
    if (verbose) console.error('Error applying schema:', err);
  } finally {
    await client.end();
  }
}

export {recreateDatabase}
