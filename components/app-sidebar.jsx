"use client"

import * as React from "react"
import {
//   AudioWaveform,
  BookOpen,
  Bot,
//   Command,
//   Frame,
//   GalleryVerticalEnd,
//   Map,
//   PieChart,
  Settings2,
  //SquareTerminal,
  BicepsFlexed,
  ChartNoAxesCombined,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import DietamigoHeader from "@/components/DietamigoHeader"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Exercise Trainer",
      url: "/exercise-trainer",
      icon: BicepsFlexed,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "History",
    //       url: "#",
    //     },
    //     {
    //       title: "Starred",
    //       url: "#",
    //     },
    //     {
    //       title: "Settings",
    //       url: "#",
    //     },
    //   ],
    },
    {
      title: "Diet Recommender",
      url: "/diet-recommender",
      icon: Bot,
    },
    {
      title: "Progress",
      url: "/progress-analysis",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Journal",
      url: "/journal",
      icon: BookOpen,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar 
      collapsible="icon" 
      className="transition-all duration-300 slide-out-to-end-translate-full transform-gpu will-change-transform"
      {...props}
    >
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pb-1 transition-all duration-700 ease-out">
        <DietamigoHeader showPlan={true} />
      </SidebarHeader>
      <SidebarContent className="p-4 group-data-[collapsible=icon]:p-0 transition-all duration-700 ease-out">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pt-1 transition-all duration-700 ease-out">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
