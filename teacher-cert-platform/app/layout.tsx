import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TeachCert Pro - Teacher Certification Exam Preparation",
  description: "Master your teacher certification exams with comprehensive courses, practice tests, and expert guidance for CSET, CBEST, NYSTCE, and more.",
  keywords: ["teacher certification", "CSET", "CBEST", "NYSTCE", "exam prep", "teacher training"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
