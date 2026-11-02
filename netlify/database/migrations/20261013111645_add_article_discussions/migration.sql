CREATE TABLE "article_votes" (
	"article" text,
	"user_id" text,
	"value" integer NOT NULL,
	CONSTRAINT "article_votes_pkey" PRIMARY KEY("article","user_id"),
	CONSTRAINT "article_vote_value" CHECK ("value" in (-1, 1))
);
--> statement-breakpoint
CREATE TABLE "comment_reactions" (
	"comment_id" uuid,
	"user_id" text,
	"emoji" text,
	CONSTRAINT "comment_reactions_pkey" PRIMARY KEY("comment_id","user_id","emoji"),
	CONSTRAINT "comment_reaction_emoji" CHECK ("emoji" in ('👍', '❤️', '💡', '🎉'))
);
--> statement-breakpoint
CREATE TABLE "article_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"article" text NOT NULL,
	"user_id" text NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comment_body_length" CHECK (char_length("body") between 1 and 2000),
	CONSTRAINT "comment_author_length" CHECK (char_length("author_name") between 2 and 60)
);
--> statement-breakpoint
CREATE TABLE "discussion_limits" (
	"user_id" text,
	"action" text,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "discussion_limits_pkey" PRIMARY KEY("user_id","action")
);
--> statement-breakpoint
CREATE INDEX "article_comments_page" ON "article_comments" ("article","created_at","id");--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_article_comments_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "article_comments"("id") ON DELETE CASCADE;