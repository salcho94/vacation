import React from "react";
import Image from "next/image";
import logo from "public/img/logo.png";
import Link from "next/link";
import Header from "@/app/pages/header";


export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>
        <Header/>
        <div className="container  mt-24">
          {children}
        </div>
      </div>
  );
}
