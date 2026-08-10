ALTER TABLE "Embedding"
ALTER COLUMN "vector" TYPE vector(768)
USING "vector"::vector(768);

CREATE INDEX "Embedding_vector_hnsw_idx"
ON "Embedding" USING hnsw ("vector" vector_cosine_ops);
