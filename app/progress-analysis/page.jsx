'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function Page() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadStats();
  }, [days]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/progress/stats?days=${days}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatExerciseName = (type) => {
    const names = {
      squats: 'Squats',
      front_squats: 'Front Squats',
      pushups: 'Push-ups',
      bicep_curls: 'Bicep Curls',
      jumping_jacks: 'Jumping Jacks',
      other: 'Other',
    };
    return names[type] || type;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="my-5 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
              <h1 className="text-3xl font-bold tracking-tight">Progress Analysis 📈</h1>
              <p className="text-muted-foreground">
                Track your health journey with detailed insights and analytics.
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="px-3 py-2 rounded-md border bg-background"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <Button variant="outline" onClick={loadStats} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading progress data...</div>
          ) : stats ? (
            <>
              {/* Overview Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Total Reps</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totals?.totalReps || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totals?.averageRepsPerSession || 0} avg per session
                    </p>
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
                      <div className="text-2xl font-bold">{stats.streak?.days || 0}</div>
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
                    <div className="text-2xl font-bold">{stats.totals?.totalCaloriesBurned || 0}</div>
                    <p className="text-xs text-muted-foreground">in {days} days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totals?.totalSessions || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totals?.totalDuration || 0} min total
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Exercise Breakdown */}
              {stats.breakdown && Object.keys(stats.breakdown).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Activity className="h-5 w-5 text-orange-600" />
                      </div>
                      Exercise Breakdown
                    </CardTitle>
                    <CardDescription>Performance by exercise type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(stats.breakdown).map(([type, data]) => (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{formatExerciseName(type)}</span>
                            <span className="text-sm text-muted-foreground">
                              {data.count} sessions, {data.totalReps} reps
                            </span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${(data.count / stats.totals.totalSessions) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Sessions */}
              {stats.recentSessions && stats.recentSessions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      Recent Exercise Sessions
                    </CardTitle>
                    <CardDescription>Your latest workout sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentSessions.slice(0, 10).map((session, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{session.exerciseName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()} • {session.reps} reps
                              {session.caloriesBurned && ` • ${session.caloriesBurned} cal`}
                            </p>
                          </div>
                          <div className="text-right">
                            {session.duration && (
                              <p className="text-sm text-muted-foreground">
                                {Math.round(session.duration / 60)} min
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {stats.totals.totalSessions === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No exercise data found for the selected period.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start tracking your workouts using the AI Fitness Tracker!
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Failed to load progress data.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
