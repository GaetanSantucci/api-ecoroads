BEGIN;

CREATE TABLE
    IF NOT EXISTS public."team"(
        "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NULL,
        "image" TEXT NULL,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
    );

;COMMIT