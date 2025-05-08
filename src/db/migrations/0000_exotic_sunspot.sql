CREATE TABLE "cookies" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"tab_id" integer NOT NULL,
	"tab_title" text,
	"favicon_url" text,
	"incognito" boolean DEFAULT false,
	"cookies_data" json NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"language" text,
	"time_zone" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
