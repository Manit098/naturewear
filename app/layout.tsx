import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import { ClerkProvider, SignIn, SignUp } from "@clerk/nextjs";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NatureWear - Sustainable Clothing",
  description: "Quality sustainable clothing inspired by nature",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border border-green-100",
              headerTitle: "text-green-700",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-green-200 hover:bg-green-50",
              formButtonPrimary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
              footerActionLink: "text-green-600 hover:text-green-700",
            },
          }}
        />
        <SignUp
          routing="hash"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border border-green-100",
              headerTitle: "text-green-700",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-green-200 hover:bg-green-50",
              formButtonPrimary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
              footerActionLink: "text-green-600 hover:text-green-700",
            },
          }}
        />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
