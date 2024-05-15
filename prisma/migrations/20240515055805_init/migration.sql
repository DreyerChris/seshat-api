-- CreateTable
CREATE TABLE "SyncAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "syncCode" TEXT NOT NULL,
    "text1" TEXT,
    "text2" TEXT,
    "text3" TEXT,
    "text4" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncAccount_syncCode_key" ON "SyncAccount"("syncCode");
