"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import AssistantWidget from "@/components/AssistantWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 删除useState、useEffect、toggleDark等与isDark相关的主题切换逻辑
  // 删除<body>内的右上角<button onClick={toggleDark} ...> ... </button>，只保留{children}和<AssistantWidget />
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
        <AssistantWidget />
      </body>
    </html>
  );
}
