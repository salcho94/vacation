import React from "react";
import Header from "@/app/(pages)/header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={`w-full ${inter.className}`} >
        <Header/>
        <div className="mt-16">
          {children}
        </div>
      </div>
  );
}
