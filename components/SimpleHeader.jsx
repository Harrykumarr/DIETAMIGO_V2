"use client";

import React from "react";
import { Nunito } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

// Import Nunito with ExtraBold
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["800"], // ExtraBold
});

const SimpleHeader = ({ showPlan = false }) => {
  return (
    <Link href="/dashboard" aria-label="Go to Dashboard - DietAmigo" className="flex items-center gap-3 cursor-pointer group">
      {/* Logo Icon */}
      <div className="bg-black text-white flex aspect-square size-12 items-center justify-center rounded-xl shrink-0 group-hover:bg-gray-800 transition-colors">
        <Image
          src="/Dietamigo_Logo.png"
          alt="DietAmigo Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col">
        <h1
          className={`${nunito.className} font-medium`}
          style={{
            fontWeight: 800,
            fontSize: "28px",
            letterSpacing: "1px",
          }}
        >
          <span className="text-foreground">DIETAM</span>
          <span style={{ color: "#5ea500" }}>I</span>
          <span className="text-foreground">GO</span>
        </h1>
        {showPlan && (
          <span className="text-xs text-muted-foreground">Enterprise</span>
        )}
      </div>
    </Link>
  );
};

export default SimpleHeader;