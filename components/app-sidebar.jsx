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
import { useSession } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Exercise Trainer",
    url: "/exercise-trainer",
    icon: BicepsFlexed,
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
]

export function AppSidebar({
  ...props
}) {
  const { data: session } = useSession();

  // Create user object from session or default values
  const user = session?.user ? {
    name: session.user.name || 'User',
    email: session.user.email || '',
    avatar: session.user.image || undefined,
  } : {
    name: 'Guest',
    email: '',
    avatar: undefined,
  };

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
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pt-1 transition-all duration-700 ease-out">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
