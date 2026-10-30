CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"tag" text NOT NULL,
	"blurb" text NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "courses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "lecture_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"lecture_id" integer NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"hw_completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lectures" (
	"id" serial PRIMARY KEY NOT NULL,
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
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lecture_progress" ADD CONSTRAINT "lecture_progress_lecture_id_lectures_id_fk" FOREIGN KEY ("lecture_id") REFERENCES "public"."lectures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lectures" ADD CONSTRAINT "lectures_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lecture_progress_lecture_idx" ON "lecture_progress" USING btree ("lecture_id");