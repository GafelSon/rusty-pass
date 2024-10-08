import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 z-10 w-full px-2 pb-1">
      <div className="footer flex justify-between">
        <p>v0.1.0</p>
        <p>Open-Gafelson</p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      <Footer />
      </body>
    </html>
  );
}
