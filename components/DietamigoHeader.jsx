"use client";

import React from "react";
import { Nunito } from "next/font/google";
import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Import Nunito with ExtraBold
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["800"], // ExtraBold
});

const DietamigoHeader = ({ showPlan = false, size = "lg" }) => {
  return (
    <SidebarMenu className="my-5">
      <SidebarMenuItem>
        <SidebarMenuButton 
          size="lg" 
          tooltip="DietAmigo" 
          asChild
          className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:justify-center transition-all duration-300 ease-in-out"
        >
          <Link href="/dashboard" aria-label="Go to Dashboard - DietAmigo">
            {/* Logo Icon */}
            <div className="bg-black text-white flex aspect-square size-12 items-center justify-center rounded-xl shrink-0">
              <Image
                src="/Dietamigo_Logo.png"
                alt="DietAmigo Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            
            {/* Text Logo */}
            <div className="grid flex-1 text-left leading-tight ml-3 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden transition-all duration-300 ease-in-out">
              <h1
                className={`${nunito.className} truncate font-medium text-sidebar-foreground`}
                style={{
                  fontWeight: 800,
                  fontSize: "28px",
                  letterSpacing: "1px",
                }}
              >
                <span className="text-sidebar-foreground">DIETAM</span>
                <span style={{ color: "#5ea500" }}>I</span>
                <span className="text-sidebar-foreground">GO</span>
              </h1>
              {showPlan && (
                <span className="truncate text-xs text-muted-foreground">Enterprise</span>
              )}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default DietamigoHeader;