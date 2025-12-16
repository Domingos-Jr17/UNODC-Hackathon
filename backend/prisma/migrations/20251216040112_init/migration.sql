-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anonymous_code" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'VICTIM',
    "real_name" TEXT,
    "phone" TEXT,
    "ngo_id" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "last_login_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" DATETIME,
    CONSTRAINT "User_ngo_id_fkey" FOREIGN KEY ("ngo_id") REFERENCES "NGO" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NGO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact_person" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "license_number" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT,
    "duration_hours" INTEGER NOT NULL,
    "modules_count" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "skills" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_code" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "completed_modules" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "current_module" INTEGER NOT NULL DEFAULT 1,
    "quiz_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_quiz_score" INTEGER,
    "last_activity" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    CONSTRAINT "Progress_user_code_fkey" FOREIGN KEY ("user_code") REFERENCES "User" ("anonymous_code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "anonymous_code" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "course_title" TEXT NOT NULL,
    "issue_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_code" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "instructor" TEXT,
    "institution" TEXT,
    "score" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 100,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_date" DATETIME,
    "verification_ip" TEXT,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revocation_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Certificate_anonymous_code_fkey" FOREIGN KEY ("anonymous_code") REFERENCES "User" ("anonymous_code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificate_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_code" TEXT,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "table_name" TEXT,
    "record_id" TEXT,
    "old_values" TEXT,
    "new_values" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_user_code_fkey" FOREIGN KEY ("user_code") REFERENCES "User" ("anonymous_code") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_anonymous_code_key" ON "User"("anonymous_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_user_code_course_id_key" ON "Progress"("user_code", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_verification_code_key" ON "Certificate"("verification_code");
