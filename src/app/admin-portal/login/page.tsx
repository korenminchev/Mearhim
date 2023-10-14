"use client";

import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import type { AuthError } from "@supabase/supabase-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<AuthError>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error);
      return;
    }

    router.push("/admin-portal");
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      boxShadow="md"
      margin="auto"
      mt={8}
    >
      <Stack spacing={3}>
        <FormControl id="email" isRequired>
          <FormLabel>אימייל</FormLabel>
          <Input
            type="email"
            placeholder="אימייל"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>סיסמה</FormLabel>
          <Input
            type="password"
            placeholder="סיסמה"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          variant="solid"
          onClick={handleSignIn}
        >
          התחברות
        </Button>
        {authError && authError.status === 400 && (
          <Text color="tomato">שגיאה בהתחברות: אימייל או סיסמה לא נכונים</Text>
        )}
      </Stack>
    </Box>
  );
}
