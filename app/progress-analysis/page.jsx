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
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  Weight,
  Activity,
  Heart,
  Zap,
  Award,
  BarChart3,
  Download,
  Share,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
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
                  <BreadcrumbLink href="/progress-analysis">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Progress Analysis
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
                Progress Analysis 📈
              </h1>
              <p className="text-muted-foreground">
                Track your health journey with detailed insights and analytics.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button style={{ backgroundColor: '#5ea500' }} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Update Data
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Weight Progress</CardTitle>
                  <Weight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">-2.5</div>
                  <div className="flex items-center text-green-600">
                    <ArrowDown className="h-4 w-4" />
                    <span className="text-sm">kg</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">14</div>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm">days</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">current streak</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">2,840</div>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm">15%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Goal Achievement</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm">5%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">vs last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Weight Progress Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Weight className="h-5 w-5 text-blue-600" />
                      </div>
                      Weight Trend
                    </CardTitle>
                    <CardDescription>Your weight progress over the last 3 months</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <TrendingDown className="h-12 w-12 text-green-600 mx-auto" />
                      <p className="text-sm text-muted-foreground">Weight Chart Visualization</p>
                      <p className="text-xs text-muted-foreground">Showing downward trend (-2.5kg)</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start: 78.5kg</span>
                    <span className="font-medium">Current: 76.0kg</span>
                    <span className="text-green-600">Target: 75.0kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Progress Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Activity className="h-5 w-5 text-orange-600" />
                      </div>
                      Activity Level
                    </CardTitle>
                    <CardDescription>Daily activity and workout consistency</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <TrendingUp className="h-12 w-12 text-orange-600 mx-auto" />
                      <p className="text-sm text-muted-foreground">Activity Chart Visualization</p>
                      <p className="text-xs text-muted-foreground">Showing improved consistency</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={day} className="text-center">
                        <div className={`h-8 rounded ${i < 5 ? 'bg-green-500' : 'bg-muted'} mb-1`}></div>
                        <span className="text-xs text-muted-foreground">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">BMI</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">22.1</span>
                    <span className="text-green-600 text-xs">Normal</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Body Fat %</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">18.5%</span>
                    <ArrowDown className="h-3 w-3 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Muscle Mass</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">42.3kg</span>
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hydration</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">85%</span>
                    <span className="text-blue-600 text-xs">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Workouts Completed</span>
                  <span className="font-medium">5/6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Calories/Day</span>
                  <span className="font-medium">2,100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sleep Quality</span>
                  <span className="font-medium text-green-600">Excellent</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Steps Average</span>
                  <span className="font-medium">12,400</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weight Goal Milestone</p>
                    <p className="text-xs text-muted-foreground">Lost 2kg this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Workout Streak</p>
                    <p className="text-xs text-muted-foreground">14 days consistent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Health Improvement</p>
                    <p className="text-xs text-muted-foreground">BMI in normal range</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    Current Goals Progress
                  </CardTitle>
                  <CardDescription>Track your progress towards set goals</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Manage Goals
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weight Loss Goal</span>
                    <span className="text-sm text-muted-foreground">75% complete</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">2.5kg lost of 3kg target</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weekly Workout Goal</span>
                    <span className="text-sm text-muted-foreground">83% complete</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">5 of 6 workouts completed this week</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Steps Goal</span>
                    <span className="text-sm text-muted-foreground">124% complete</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">12,400 steps today (target: 10,000)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
