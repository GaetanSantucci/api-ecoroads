-- Deploy ecoroads:01.init to pg

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DOMAIN EMAIL AS TEXT CHECK ( value ~ '^[\w\-\.]+@([\w-]+\.)+[\w-]+$');


CREATE TABLE
    IF NOT EXISTS public."user"(
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" EMAIL UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "location_id" INT NOT NULL,
        "car_id" INT NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );

CREATE TABLE
    IF NOT EXISTS public."network"(
        "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );

CREATE TABLE
    IF NOT EXISTS public."car"(
        "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "brand" TEXT NOT NULL UNIQUE,
        "model" TEXT NOT NULL UNIQUE,
        "image" TEXT NULL,
        "network_id" INT NULL REFERENCES "network" ("id"),
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );


CREATE TABLE
    IF NOT EXISTS public."location"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "address" TEXT NOT NULL,
    "street_number" INT NULL,
    "zipcode" NUMERIC NOT NULL,
    "city" TEXT NOT NULL,
    "lat" NUMERIC NULL,
    "lon" NUMERIC NULL
);

CREATE TABLE
    IF NOT EXISTS public."category"(
        "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );


CREATE TABLE
    IF NOT EXISTS public."charging_station" (
        "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "network_id" INT NULL REFERENCES "network" ("id"),
        "location_id" INTEGER NOT NULL REFERENCES "location"("id"),
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );

CREATE TABLE
    IF NOT EXISTS public."interesting_point" (
        "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "description" TEXT NULL,
        "eco_friendly" BOOLEAN DEFAULT FALSE,
        "category_id" INTEGER NOT NULL REFERENCES "category"("id"),
        "location_id" INTEGER NOT NULL REFERENCES "location"("id"),
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );

CREATE TABLE
    IF NOT EXISTS public."road" (
        "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "favorite" BOOLEAN DEFAULT FALSE,
        "generated_road" TEXT NULL,
        "user_id" uuid NOT NULL REFERENCES "user"("id"),
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );

CREATE TABLE
    IF NOT EXISTS public."user_like_category"(
        "category_id" integer REFERENCES "category"("id"),
        "user_id" uuid REFERENCES "user"("id"),
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz
    );

ALTER TABLE "user" ADD FOREIGN KEY ("car_id") REFERENCES "car"("id"); 
ALTER TABLE "user" ADD FOREIGN KEY ("location_id") REFERENCES "location"("id");



COMMIT;
