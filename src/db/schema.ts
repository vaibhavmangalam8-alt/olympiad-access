import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  tag: text("tag").notNull(),
  blurb: text("blurb").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const lectures = pgTable("lectures", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  topic: text("topic").notNull(),
  sub: text("sub"),
  kind: text("kind").notNull().default("lecture"), // 'lecture' | 'external' | 'practice'
  videoId: text("video_id"),
  videoUrl: text("video_url"),
  notesUrl: text("notes_url"),
  hwText: text("hw_text"),
  hwUrl: text("hw_url"),
  sortOrder: integer("sort_order").notNull(),
});

export const lectureProgress = pgTable(
  "lecture_progress",
  {
    id: serial("id").primaryKey(),
    lectureId: integer("lecture_id")
      .notNull()
      .references(() => lectures.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull(),
    hwCompletedAt: timestamp("hw_completed_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("lecture_progress_lecture_idx").on(t.lectureId)],
);
