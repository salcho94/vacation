import React from "react";
import Header from "@/app/(pages)/header";


export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="w-full">
        <Header/>
        <div className="mt-16">
          {children}
        </div>
      </div>
  );
}
