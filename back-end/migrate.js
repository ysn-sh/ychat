const dotenv = require('dotenv');
dotenv.config();

console.log('Running migrations against database:', process.env.DATABASE_URL.replace(/:.*@/, ':****@'));

const { execSync } = require('child_process');
execSync('npx node-pg-migrate up', { stdio: 'inherit' });