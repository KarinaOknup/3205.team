-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_url" TEXT NOT NULL,
    "alias" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" SERIAL NOT NULL,
    "short_url" TEXT NOT NULL,
    "url_id" INTEGER NOT NULL,
    "user_ip" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Redirect" ADD CONSTRAINT "Redirect_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
