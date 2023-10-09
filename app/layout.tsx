"use client";

import { ChakraProvider } from '@chakra-ui/react'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="rtl">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <ChakraProvider>
        <body>{children}</body>
      </ChakraProvider>
    </html>
  )
}
