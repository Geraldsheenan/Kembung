import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv, loadEnvFile } from "./_load-env.mjs";

loadEnvFile();

function getArg(name) {
  const prefix = `--${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : "";
}

const email = getArg("email").trim().toLowerCase();
const password = getArg("password");
const displayName = getArg("name").trim();

if (!email) {
  console.error("Missing --email=you@example.com");
  process.exit(1);
}

const supabase = createClient(
  getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function findUserByEmail(targetEmail) {
  let page = 1;

  while (page < 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });

    if (error) {
      throw error;
    }

    const user = data.users.find((item) => item.email?.toLowerCase() === targetEmail);

    if (user) {
      return user;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }

  return null;
}

async function run() {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: password || undefined,
      app_metadata: {
        ...(existingUser.app_metadata ?? {}),
        role: "admin",
      },
      user_metadata: displayName
        ? {
            ...(existingUser.user_metadata ?? {}),
            display_name: displayName,
          }
        : existingUser.user_metadata,
    });

    if (error) {
      throw error;
    }

    console.log(`Updated existing user as admin: ${data.user?.email ?? email}`);
    return;
  }

  if (!password) {
    console.error("New admin user requires --password=yourPassword");
    process.exit(1);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
    user_metadata: displayName ? { display_name: displayName } : {},
  });

  if (error) {
    throw error;
  }

  console.log(`Created admin user: ${data.user?.email ?? email}`);
}

run().catch((error) => {
  console.error("Failed to create or update Supabase admin user.");
  console.error(error);
  process.exit(1);
});
