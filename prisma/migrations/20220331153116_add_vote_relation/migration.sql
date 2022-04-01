/*
  Warnings:

  - You are about to drop the column `postedById` on the `Link` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Link" ("createdAt", "description", "id", "url", "userId") SELECT "createdAt", "description", "id", "url", "userId" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
