"use client"; // Ensure this is at the top to mark the layout as client-side
import { UserProvider } from "@auth0/nextjs-auth0/client"
import localFont from "next/font/local";  // Ensure font path is correct
import "./globals.css";  // Ensure this file exists and the path is correct

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",  // Ensure font file exists at this path
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",  // Ensure font file exists at this path
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>{children} </UserProvider>
      
      </body>
    </html>
  );
}
