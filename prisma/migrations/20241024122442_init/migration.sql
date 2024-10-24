-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "bookshelves" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "download_count" INTEGER NOT NULL,
    "textPath" TEXT
);
