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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Trash2,
  X,
  Save
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    type: 'meal',
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    calories: '',
    mealType: '',
    duration: '',
    caloriesBurned: '',
    workoutType: '',
    mood: '',
    energyLevel: '',
    sleepHours: '',
    goalCategory: '',
    progressValue: '',
    tags: '',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setFormData({
      type: 'meal',
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      calories: '',
      mealType: '',
      duration: '',
      caloriesBurned: '',
      workoutType: '',
      mood: '',
      energyLevel: '',
      sleepHours: '',
      goalCategory: '',
      progressValue: '',
      tags: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      title: entry.title,
      content: entry.content || '',
      date: new Date(entry.date).toISOString().split('T')[0],
      calories: entry.calories || '',
      mealType: entry.mealType || '',
      duration: entry.duration || '',
      caloriesBurned: entry.caloriesBurned || '',
      workoutType: entry.workoutType || '',
      mood: entry.mood || '',
      energyLevel: entry.energyLevel || '',
      sleepHours: entry.sleepHours || '',
      goalCategory: entry.goalCategory || '',
      progressValue: entry.progressValue || '',
      tags: entry.tags?.join(', ') || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadEntries();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        date: formData.date,
      };

      // Add type-specific fields
      if (formData.type === 'meal') {
        if (formData.calories) payload.calories = parseFloat(formData.calories);
        if (formData.mealType) payload.mealType = formData.mealType;
      } else if (formData.type === 'workout') {
        if (formData.duration) payload.duration = parseFloat(formData.duration);
        if (formData.caloriesBurned) payload.caloriesBurned = parseFloat(formData.caloriesBurned);
        if (formData.workoutType) payload.workoutType = formData.workoutType;
      } else if (formData.type === 'mood') {
        if (formData.mood) payload.mood = formData.mood;
        if (formData.energyLevel) payload.energyLevel = formData.energyLevel;
        if (formData.sleepHours) payload.sleepHours = parseFloat(formData.sleepHours);
      } else if (formData.type === 'goal') {
        if (formData.goalCategory) payload.goalCategory = formData.goalCategory;
        if (formData.progressValue) payload.progressValue = parseFloat(formData.progressValue);
      }

      if (formData.tags) {
        payload.tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      const url = editingEntry ? `/api/journal/${editingEntry._id}` : '/api/journal';
      const method = editingEntry ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        loadEntries();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save entry');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error saving entry');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meal': return <Utensils className="h-5 w-5 text-green-600" />;
      case 'workout': return <Dumbbell className="h-5 w-5 text-orange-600" />;
      case 'mood': return <Heart className="h-5 w-5 text-blue-600" />;
      case 'goal': return <Target className="h-5 w-5 text-purple-600" />;
      default: return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const todayEntries = entries.filter(e => {
    const entryDate = new Date(e.date).toDateString();
    return entryDate === new Date().toDateString();
  });

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
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Health Journal 📝</h1>
              <p className="text-muted-foreground">
                Track your daily health journey, meals, workouts, and progress.
              </p>
            </div>
            <Button onClick={handleNewEntry} style={{ backgroundColor: '#5ea500' }} className="flex items-center gap-2">
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
                <div className="text-2xl font-bold">{todayEntries.length}</div>
                <p className="text-xs text-muted-foreground">
                  {todayEntries.filter(e => e.type === 'meal').length} meals,{' '}
                  {todayEntries.filter(e => e.type === 'workout').length} workouts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entries.length}</div>
                <p className="text-xs text-muted-foreground">all time</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Entries */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Entries</h2>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading entries...</div>
            ) : entries.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No entries yet. Start tracking your health journey!</p>
                  <Button onClick={handleNewEntry} style={{ backgroundColor: '#5ea500' }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Entry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry._id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            {getTypeIcon(entry.type)}
                          </div>
                          <div>
                            <CardTitle className="text-base">{entry.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {formatDate(entry.date)}, {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEntry(entry._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {entry.content && (
                        <p className="text-sm text-muted-foreground mb-3">{entry.content}</p>
                      )}
                      <div className="flex gap-2 flex-wrap text-xs">
                        {entry.type === 'meal' && entry.calories && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{entry.calories} cal</span>
                        )}
                        {entry.type === 'workout' && entry.caloriesBurned && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{entry.caloriesBurned} cal burned</span>
                        )}
                        {entry.type === 'workout' && entry.duration && (
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">{entry.duration} min</span>
                        )}
                        {entry.tags && entry.tags.map((tag, i) => (
                          <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{tag}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Entry Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Entry' : 'New Journal Entry'}</DialogTitle>
              <DialogDescription>
                {editingEntry ? 'Update your journal entry' : 'Create a new entry to track your health journey'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meal">Meal</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                    <SelectItem value="mood">Mood & Energy</SelectItem>
                    <SelectItem value="goal">Goal Progress</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Add details..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              {formData.type === 'meal' && (
                <>
                  <div className="space-y-2">
                    <Label>Calories</Label>
                    <Input
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({...formData, calories: e.target.value})}
                      placeholder="Calories"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meal Type</Label>
                    <Select value={formData.mealType} onValueChange={(value) => setFormData({...formData, mealType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formData.type === 'workout' && (
                <>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="Duration"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calories Burned</Label>
                    <Input
                      type="number"
                      value={formData.caloriesBurned}
                      onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
                      placeholder="Calories burned"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Workout Type</Label>
                    <Select value={formData.workoutType} onValueChange={(value) => setFormData({...formData, workoutType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="flexibility">Flexibility</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formData.type === 'mood' && (
                <>
                  <div className="space-y-2">
                    <Label>Mood</Label>
                    <Select value={formData.mood} onValueChange={(value) => setFormData({...formData, mood: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="okay">Okay</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="terrible">Terrible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Energy Level</Label>
                    <Select value={formData.energyLevel} onValueChange={(value) => setFormData({...formData, energyLevel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select energy level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sleep Hours</Label>
                    <Input
                      type="number"
                      value={formData.sleepHours}
                      onChange={(e) => setFormData({...formData, sleepHours: e.target.value})}
                      placeholder="Hours of sleep"
                      min="0"
                      max="24"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g., healthy, protein, low-carb"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#5ea500' }}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingEntry ? 'Update' : 'Create'} Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
