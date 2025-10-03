// Example component showing proper theme usage for Dietamigo
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ThemedDashboardExample = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page Header - uses theme colors */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your health journey</p>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        
        {/* Stats Cards - using theme-aware card styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">75.2 kg</div>
              <Badge variant="secondary" className="mt-2 bg-secondary text-secondary-foreground">
                -2.3 kg this month
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                BMI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">22.1</div>
              <span className="text-sm text-muted-foreground">Normal range</span>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Workouts This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4</div>
              <span className="text-sm text-muted-foreground">Goal: 5 sessions</span>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons - using consistent button theming */}
        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Log Workout
          </Button>
          <Button 
            variant="secondary" 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Track Meal
          </Button>
          <Button 
            variant="outline" 
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            View Progress
          </Button>
        </div>

        {/* Content Panel */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Morning Run</p>
                  <p className="text-sm text-muted-foreground">30 minutes • 5.2 km</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Completed
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Healthy Breakfast</p>
                  <p className="text-sm text-muted-foreground">Oatmeal with berries • 320 cal</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Logged
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ThemedDashboardExample;