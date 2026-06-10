-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."articulos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "publication" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "edition" TEXT,
    "source_id" TEXT,
    "headline" TEXT NOT NULL,
    "subheadline" TEXT,
    "body" TEXT NOT NULL,
    "byline" TEXT,
    "section" TEXT,
    "genre" TEXT NOT NULL,
    "topics" TEXT[],
    "people" TEXT[],
    "places" TEXT[],
    "summary" TEXT,
    "has_image" BOOLEAN DEFAULT false,
    "uncertain_fields" TEXT[],
    "embedding" vector(768),
    "event_id" UUID,
    "fts_vector" tsvector GENERATED ALWAYS AS (setweight(to_tsvector('spanish'::regconfig, COALESCE(headline, ''::text)), 'A'::"char") || setweight(to_tsvector('spanish'::regconfig, COALESCE(body, ''::text)), 'C'::"char")) STORED,
    "entities" TEXT[],

    CONSTRAINT "articulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."coleccion_articulos" (
    "coleccion_id" UUID NOT NULL,
    "articulo_id" UUID NOT NULL,
    "nota" TEXT,
    "added_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coleccion_articulos_pkey" PRIMARY KEY ("coleccion_id","articulo_id")
);

-- CreateTable
CREATE TABLE "public"."colecciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "colecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_articulos_fecha" ON "public"."articulos"("date" ASC);

-- CreateIndex
CREATE INDEX "idx_articulos_fts" ON "public"."articulos" USING GIN ("fts_vector" tsvector_ops);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email" ASC);

-- AddForeignKey
ALTER TABLE "public"."coleccion_articulos" ADD CONSTRAINT "coleccion_articulos_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."coleccion_articulos" ADD CONSTRAINT "coleccion_articulos_coleccion_id_fkey" FOREIGN KEY ("coleccion_id") REFERENCES "public"."colecciones"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."colecciones" ADD CONSTRAINT "colecciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

