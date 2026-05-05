-- Create turnow database if it doesn't exist
SELECT 'CREATE DATABASE turnow' 
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'turnow')\gexec
