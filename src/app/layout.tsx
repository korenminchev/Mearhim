import { Providers } from "@/src/app/utils/providers/providers";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "אתר ״מארחים״",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="rtl">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
