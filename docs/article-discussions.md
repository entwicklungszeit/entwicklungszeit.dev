# Article discussions

Published blog articles include up/down voting, comments and emoji reactions. Anyone can read discussions. Only readers signed in through Google or GitHub can participate. Comments appear immediately after Google reCAPTCHA verification. Readers can choose a public display name, remove their own comments, and undo their votes and reactions.

## Deployment setup

1. Deploy the changes to Netlify. The Identity feature marker enables Netlify Identity, and the database integration provisions Netlify Database and applies the migrations in `netlify/database/migrations`. No database connection string is needed.
2. In the site's Netlify Identity settings, enable Google and/or GitHub under external providers. Configure each provider's OAuth application using the callback URL shown by Netlify. Keep provider credentials in the Netlify dashboard, not the repository. Set the Identity site URL to the public site URL. Keep registration open so new social accounts can participate. The API rejects email/password accounts even if email registration is enabled elsewhere.
3. Create a **reCAPTCHA v2 “I'm not a robot” checkbox** configuration. Add the public site domains and any preview domains used for testing. Other reCAPTCHA versions are not compatible with this widget.
4. Configure `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` in Netlify environment settings with the **Functions** scope. Apply them to the appropriate deploy contexts and redeploy. The API supplies the public site key at runtime; only the server uses the secret. Never put the secret into a `PUBLIC_` variable. Comments are disabled until both settings are available. Ratings and reactions remain independent of CAPTCHA.
5. Sign in once, then optionally assign the `moderator` or `admin` role to the owner's Identity account through Netlify's user administration. These roles can remove any comment from the article interface. Roles must be administrator-managed, never user metadata.
6. Publish an article by setting its content `status` to `public`. **All current blog files are drafts**, so the existing site does not currently generate any article detail pages. This feature does not publish drafts automatically.

No provider credentials or reCAPTCHA settings were supplied with this request. Social login and real CAPTCHA verification require the configuration above before they can be tested end to end. The server deliberately refuses unprotected comment submission instead of bypassing missing configuration.

## Behavior and safety

- Each account has one vote per article. Clicking the selected vote removes it; choosing the other direction updates it.
- Reactions are explicit add/remove operations, with one of each emoji per account and comment. Database constraints prevent duplicate votes and reactions under concurrent requests.
- Comments contain plain text, not HTML or Markdown. Vue escapes display names and comment bodies. Comment lengths are limited to 2,000 characters; display names to 2–60 characters.
- All mutations require a same-origin JSON request and server-validated Google/GitHub authentication. Reader IDs and email addresses are not included in public discussion responses.
- CAPTCHA verification checks Google's response, the current site's hostname and the proof's age. Google rejects reused tokens. The widget loads only after the reader explicitly enables it; it is reset after each comment attempt.
- Per-account limits are stored and updated atomically in Postgres: five comment attempts and sixty attempts of each other action per ten-minute window. Limits are shared across all articles. Netlify's function-level limit additionally caps requests by IP at 120 per minute; platform availability can depend on the site's plan.
- Only published articles accept discussion requests. Comments are loaded in pages of twenty, oldest first. Deleting a comment also removes its reactions through a database foreign key.
- Authors can remove their own comments. Trusted moderators can remove unwanted posts without introducing a pre-publication approval queue. For account-wide data removal, the site owner must also remove the user's comments, votes, reactions and rate-limit rows; deleting an Identity account alone does not erase discussion records. Use the administrator tooling appropriate for the site's database and retain an audit process outside public discussion responses.

The privacy page explains the new data processing and on-demand CAPTCHA loading. Have the site's privacy wording and retention policy reviewed before enabling the feature publicly; this update does not make a legal-compliance guarantee.

## Verification

Run `pnpm test` for validation, authentication, anti-bot, authorization and component tests, and `pnpm check` for Astro/TypeScript checks. Use Netlify development emulation rather than plain Astro development for live API and Identity flows. No build command is necessary for the automated deployment pipeline.

The feature's scoped Vue/TypeScript checks passed during implementation. A whole-site Vue check additionally reported pre-existing errors in `src/components/ui/Button.vue` and `src/components/ui/ScrollToTop.vue`; these unrelated components were not changed.

After provider and CAPTCHA setup, verify a full round trip through both providers, publication of a comment, CAPTCHA expiry/replay rejection, vote changes/removal, reaction changes/removal, pagination and author/moderator deletion. Reading an article must not contact Google reCAPTCHA before the explicit load button is clicked.
