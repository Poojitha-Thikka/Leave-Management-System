-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leave_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "days" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "leaveType" TEXT NOT NULL DEFAULT 'Unspecified',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "decision_by" TEXT,
    "decision_note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "leave_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_leave_requests" ("created_at", "days", "decision_by", "decision_note", "end_date", "id", "reason", "start_date", "status", "updated_at", "user_id") SELECT "created_at", "days", "decision_by", "decision_note", "end_date", "id", "reason", "start_date", "status", "updated_at", "user_id" FROM "leave_requests";
DROP TABLE "leave_requests";
ALTER TABLE "new_leave_requests" RENAME TO "leave_requests";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
