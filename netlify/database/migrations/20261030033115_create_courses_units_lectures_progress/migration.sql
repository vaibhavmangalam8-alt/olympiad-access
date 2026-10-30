CREATE TABLE "courses" (
	"id" serial PRIMARY KEY,
	"code" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"tag" text NOT NULL,
	"blurb" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lecture_progress" (
	"id" serial PRIMARY KEY,
	"lecture_id" integer NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"hw_completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lectures" (
	"id" serial PRIMARY KEY,
	"unit_id" integer NOT NULL,
	"day_number" integer NOT NULL,
	"topic" text NOT NULL,
	"sub" text,
	"kind" text DEFAULT 'lecture' NOT NULL,
	"video_id" text,
	"video_url" text,
	"notes_url" text,
	"hw_text" text,
	"hw_url" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY,
	"course_id" integer NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "lecture_progress_lecture_idx" ON "lecture_progress" ("lecture_id");--> statement-breakpoint
ALTER TABLE "lecture_progress" ADD CONSTRAINT "lecture_progress_lecture_id_lectures_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lectures" ADD CONSTRAINT "lectures_unit_id_units_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;