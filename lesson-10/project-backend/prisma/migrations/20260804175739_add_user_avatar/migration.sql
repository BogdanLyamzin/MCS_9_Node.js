-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarPublicId" TEXT,
ADD COLUMN     "avatarUrl" TEXT;

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "sess" SET DATA TYPE JSONB;
