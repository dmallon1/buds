CREATE TABLE entries (
	id serial PRIMARY KEY,
	emotion VARCHAR ( 50 ) NOT NULL,
	intensity INT NOT NULL,
	entry VARCHAR ( 2048 ) NOT NULL,
	created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    first_name VARCHAR (128) NOT NULL,
    email VARCHAR (256) UNIQUE NOT NULL,
    password VARCHAR (256) NOT NULL,
	created TIMESTAMP NOT NULL DEFAULT NOW()
);
