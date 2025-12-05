import "./globals.css";
import type { Metadata } from "next";
import { Nav } from "./(nav)/nav";
import { ThemeProvider } from "next-themes";



export const metadata: Metadata = {
  title: "zero nickels - Tools to save optimize spends, tax and more",
  description: " - Tools to save optimize spends, tax and more",
  icons: {
    icon: {
      url: '/favicon.svg',
      href: '/favicon.svg',
    },
    apple: {
      url: '/favicon.svg',
      href: '/favicon.svg',
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
        
        {/* <link rel="icon" type="image/svg+xml" sizes="45x45" href="/favicon.svg?<generated>" /> */}
      </head>
      <body
        className={` antialiased `}
      >
        <ThemeProvider attribute={'class'}>

          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
