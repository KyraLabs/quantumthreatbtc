CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"type" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"external_link" text NOT NULL,
	"technical_level" text NOT NULL,
	"authors" text[] DEFAULT '{}'::text[] NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"extras" jsonb DEFAULT '{}'::jsonb,
	"last_verified" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "idx_resources_type" ON "resources" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_resources_date" ON "resources" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_resources_technical_level" ON "resources" USING btree ("technical_level");--> statement-breakpoint
CREATE INDEX "idx_resources_tags" ON "resources" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "idx_resources_extras" ON "resources" USING gin ("extras");