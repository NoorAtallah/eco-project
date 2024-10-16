// src/app/layout.js (or wherever your layout file is located)
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from './context/cartcontext'; // Ensure this path is correct


import Header from "./navbar/page";
import Footer from "./footer/page";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (

    <CartProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header/>
          {children}
          <Footer/>
        </body>
      </html>
    </CartProvider>
  );
}
