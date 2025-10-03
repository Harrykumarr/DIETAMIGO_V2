import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Link from "next/link"
import { 
  Utensils, 
  Dumbbell, 
  BookOpen, 
  TrendingUp,
  ArrowRight 
} from "lucide-react"

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'there';
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="my-5 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}

            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>

          </div>
        </header>
        
        {/* Welcome Section */}
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your health and fitness journey? Explore our features below.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Diet Recommender */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Utensils className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Diet Recommender</CardTitle>
                </div>
                <CardDescription>
                  Get personalized meal plans and nutrition recommendations tailored to your goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" style={{ backgroundColor: '#5ea500' }}>
                  <Link href="/diet-recommender" className="flex items-center gap-2">
                    Explore Diet Plans
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Exercise Trainer */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Dumbbell className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Exercise Trainer</CardTitle>
                </div>
                <CardDescription>
                  Access personalized workout routines and fitness training programs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/exercise-trainer" className="flex items-center gap-2">
                    Start Training
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Journal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Health Journal</CardTitle>
                </div>
                <CardDescription>
                  Track your daily meals, workouts, and health progress in your personal journal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/journal" className="flex items-center gap-2">
                    Open Journal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Analysis */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Progress Analysis</CardTitle>
                </div>
                <CardDescription>
                  View detailed analytics and insights about your health and fitness progress.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/progress-analysis" className="flex items-center gap-2">
                    View Analytics
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Today's Goal</p>
                      <p className="text-2xl font-bold">Stay Healthy</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Utensils className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Streak</p>
                      <p className="text-2xl font-bold">Keep Going!</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Next Step</p>
                      <p className="text-2xl font-bold">Explore Features</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Dumbbell className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
