-- Active: 1759236790746@@127.0.0.1@5432@electronics
CREATE DATABASE electronics;

CREATE TABLE brand (
    id  SERIAL PRIMARY KEY,
    name VARCHAR
);


CREATE TABLE model (
    id  SERIAL PRIMARY KEY,
    brand_id SMALLINT REFERENCES brand(id) ON  DELETE CASCADE,
    name VARCHAR
);

CREATE TYPE color_enum AS ENUM ('black', 'white', 'green', 'yellow', 'red');
CREATE TABLE phone(
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    price DECIMAL,
    brand_id SMALLINT REFERENCES brand(id) ON DELETE CASCADE,
    model_id SMALLINT REFERENCES model(id) ON DELETE CASCADE,
    color color_enum,
    display DECIMAL,
    ram VARCHAR,
    memory VARCHAR
);

CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    phone_number VARCHAR
);
CREATE TYPE order_enum AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customer(id) ON  DELETE CASCADE,
    total_price DECIMAL,
    order_date date,
    order_status order_enum
);
CREATE TABLE order_detail (
    id SERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    phone_id BIGINT REFERENCES phone(id) ON DELETE CASCADE,
    quantity SMALLINT
);
