import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Box } from "@chakra-ui/react";
import Signout from "./Signout";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function AdminPortal() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin-portal/login");
  }

  return (
    <Box>
      <h1>Admin portal</h1>
      <h1>User: {session && session.user.email}</h1>
      <Signout />
    </Box>
  );
}
