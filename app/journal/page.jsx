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
import { 
  BookOpen, 
  Plus,
  Calendar,
  TrendingUp,
  Target,
  Heart,
  Utensils,
  Dumbbell,
  Clock,
  Edit,
  MoreHorizontal
} from "lucide-react"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="my-5 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/journal">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Health Journal
                    </div>
                  </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Health Journal 📝
              </h1>
              <p className="text-muted-foreground">
                Track your daily health journey, meals, workouts, and progress.
              </p>
            </div>
            <Button style={{ backgroundColor: '#5ea500' }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Today's Entries</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 meals, 1 workout</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Weekly Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">days consistent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92</div>
                <p className="text-xs text-muted-foreground">excellent</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Entries</h2>
              <Button variant="outline" className="text-sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {/* Today's Entries */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Utensils className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Breakfast - Healthy Start</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Today, 8:30 AM
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Had a nutritious breakfast with oatmeal, fresh berries, and almond milk. 
                    Feeling energized and ready for the day!
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Healthy</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">350 cal</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">High Fiber</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Morning Workout</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Today, 7:00 AM
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Completed 30-minute cardio session followed by strength training. 
                    Focus on upper body exercises today.
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">30 min</span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded">245 cal burned</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Upper Body</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Mood & Energy Check</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Yesterday, 9:00 PM
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Feeling great today! Energy levels high throughout the day. 
                    Good sleep quality and staying hydrated helped a lot.
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Energy: High</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Mood: Great</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Sleep: 8h</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Journal Categories */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Quick Add Entry</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="p-3 bg-green-100 rounded-lg mx-auto w-fit">
                    <Utensils className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base">Meal Entry</CardTitle>
                  <CardDescription className="text-sm">
                    Log your meals and nutrition
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="p-3 bg-orange-100 rounded-lg mx-auto w-fit">
                    <Dumbbell className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-base">Workout Log</CardTitle>
                  <CardDescription className="text-sm">
                    Track your exercise routine
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg mx-auto w-fit">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">Mood & Energy</CardTitle>
                  <CardDescription className="text-sm">
                    Record how you're feeling
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg mx-auto w-fit">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-base">Goals Progress</CardTitle>
                  <CardDescription className="text-sm">
                    Update your goal progress
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
