"use client";

import { ChakraProvider } from '@chakra-ui/react'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="rtl">
      <ChakraProvider>
        <body>{children}</body>
      </ChakraProvider>
    </html>
  )
}
