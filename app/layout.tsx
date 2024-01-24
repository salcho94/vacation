import './globals.css';
import React from "react";


let title = 'js Company';
let description =
  '근태관리 솔루션';

export const metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="content-center">{children}</body>
    </html>
  );
}


