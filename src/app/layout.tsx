import { type Metadata } from "next";
import { ClientProvider } from "#hooks";

export const metadata: Metadata = {
  title: "Next.js",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
