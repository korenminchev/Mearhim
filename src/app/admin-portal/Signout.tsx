"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";

export default function Signout() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/");
    }
  };

  return <Button onClick={handleSignout}>Sign out</Button>;
}
