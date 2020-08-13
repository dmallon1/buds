CREATE TABLE entries (
	id serial PRIMARY KEY,
	emotion VARCHAR ( 50 ) NOT NULL,
	intensity INT NOT NULL,
	entry VARCHAR ( 2048 ) UNIQUE NOT NULL,
	created TIMESTAMP NOT NULL
);
