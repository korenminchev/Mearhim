"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Box, Button } from "@chakra-ui/react";

import type { NextPage } from "next";
import type { Session } from "@supabase/auth-helpers-nextjs";

const AdminPortal: NextPage = () => {
  const [session, setSession] = useState<Session>();
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin-portal/login");
        return;
      }
      setSession(session);
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  };

  return (
    <Box>
      <h1>Admin portal</h1>
      <h1>User: {session && session.user.email}</h1>
      <Button onClick={handleSignOut}>Sign out</Button>
    </Box>
  );
};

export default AdminPortal;
