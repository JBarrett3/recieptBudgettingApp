import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { recreateDatabase } from './refreshDB.js';

const DB_NAME = 'prod'; // Can be changed to either 'prod' or 'dev' or something else if desireable

recreateDatabase(DB_NAME, true)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });