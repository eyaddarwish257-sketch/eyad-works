# Eyad Works

Portfolio website and admin CMS built with React, Vite, and Supabase.

## Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/migrations/20261106160000_initial_schema.sql`](./supabase/migrations/20261106160000_initial_schema.sql).
3. Copy the project URL and its public publishable key from **Project Settings → API**.
4. Set these values in a local `.env` file and in the Vercel project's Production and Preview environment variables:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-public-publishable-key
   VITE_ADMIN_EMAIL=eyaddarwish257@gmail.com
   ```

   The older Supabase `anon` key is also accepted as `VITE_SUPABASE_ANON_KEY`. Never put a Supabase secret or service-role key in a `VITE_` variable or browser code.

5. In Supabase **Authentication → URL Configuration**, set the production site URL and add the local and deployed admin login URLs to the redirect allow list.
6. In Supabase **Authentication → Users**, create the administrator using the email in `VITE_ADMIN_EMAIL`. Require email confirmation in the Supabase Auth settings.
7. Grant the admin role to that user in the Supabase SQL Editor:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where lower(email) = lower('eyaddarwish257@gmail.com');
   ```

   Confirm that exactly one user row was updated. The admin role is stored in protected app metadata, not client-editable user metadata. If you change `VITE_ADMIN_EMAIL`, use that same address in this SQL.
8. For live AI portfolio context in the chat function, also configure `SUPABASE_URL` and either `SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY` as server environment variables. Do not use a service-role key.
9. Deploy the site. Sign in at `/admin/login`; use **Forgot password?** if you need to set or reset the password.

The database migration enables row-level security: visitors can read published projects and submit contact messages; only the configured admin can manage CMS records or upload/delete project images. Do not disable these policies or expose service-role credentials.

The app falls back to its bundled portfolio content when Supabase is not configured. Existing records from the previous CMS are not copied automatically; import them into `cms_records` after setup if you need them in the CMS.

## Local development

Install dependencies and run the Vite development server:

```sh
npm install
npm run dev
```

Run the production type-check and build with `npm run build`, or lint with `npm run lint`.
