CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE articulos (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication      TEXT NOT NULL,
    date             DATE NOT NULL,
    edition          TEXT,
    source_id        TEXT,
    headline         TEXT NOT NULL,
    subheadline      TEXT,
    body             TEXT NOT NULL,
    byline           TEXT,
    section          TEXT,
    genre            TEXT NOT NULL,
    topics           TEXT[],
    people           TEXT[],
    entities         TEXT[],
    places           TEXT[],
    summary          TEXT,
    has_image        BOOLEAN DEFAULT FALSE,
    uncertain_fields TEXT[],
    embedding        vector(768),
    event_id         UUID,
    fts_vector       TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('spanish', coalesce(headline, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(body, '')), 'C')
    ) STORED
);

CREATE INDEX idx_articulos_fts   ON articulos USING GIN (fts_vector);
CREATE INDEX idx_articulos_fecha ON articulos (date);

CREATE TABLE usuarios (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE colecciones (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre     TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE coleccion_articulos (
    coleccion_id UUID REFERENCES colecciones(id) ON DELETE CASCADE,
    articulo_id  UUID REFERENCES articulos(id) ON DELETE CASCADE,
    nota         TEXT,
    added_at     TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (coleccion_id, articulo_id)
);