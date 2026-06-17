-- AlterTable
ALTER TABLE "ContactRequest" ADD COLUMN     "note" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'new';

-- CreateIndex
CREATE INDEX "ContactRequest_status_idx" ON "ContactRequest"("status");
