import { type Metadata } from "next";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";

export const metadata: Metadata = {
  title: "Next.js",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <header>
            <GlobalNavigation />
          </header>
          {children}
          <footer>Repo URL</footer>
        </ClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
