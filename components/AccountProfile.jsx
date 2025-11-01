"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { 
  User, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export default function AccountProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    dietaryRestrictions: [],
  })

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-free' },
    { value: 'lactose-free', label: 'Lactose-free' },
    { value: 'nut-free', label: 'Nut-free' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
  ]

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile', { credentials: 'same-origin' })
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setProfile({
              age: data.profile.age || "",
              weight: data.profile.weight || "",
              height: data.profile.height || "",
              gender: data.profile.gender || "",
              activityLevel: data.profile.activityLevel || "",
              dietaryRestrictions: data.profile.dietaryRestrictions || [],
            })
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to load profile:", err)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
    setError("")
    setSuccess(false)
  }

  const toggleDietaryRestriction = (restriction) => {
    setProfile(prev => {
      const set = new Set(prev.dietaryRestrictions || [])
      if (set.has(restriction)) set.delete(restriction)
      else set.add(restriction)
      return { ...prev, dietaryRestrictions: Array.from(set) }
    })
    setError("")
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      // Validate inputs
      if (profile.age && (profile.age < 1 || profile.age > 150)) {
        setError("Age must be between 1 and 150")
        setSaving(false)
        return
      }

      if (profile.weight && (profile.weight < 1 || profile.weight > 500)) {
        setError("Weight must be between 1 and 500 kg")
        setSaving(false)
        return
      }

      if (profile.height && (profile.height < 0.5 || profile.height > 3)) {
        setError("Height must be between 0.5 and 3 meters")
        setSaving(false)
        return
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          profile: {
            age: profile.age ? parseInt(profile.age) : undefined,
            weight: profile.weight ? parseFloat(profile.weight) : undefined,
            height: profile.height ? parseFloat(profile.height) : undefined,
            gender: profile.gender || undefined,
            activityLevel: profile.activityLevel || undefined,
            dietaryRestrictions: profile.dietaryRestrictions,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to save profile")
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("An error occurred while saving. Please try again.")
      console.error("Profile save error:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Update your profile information to get personalized diet and fitness recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your health profile helps us provide better recommendations
                </CardDescription>
              </div>
            </div>

            {/* Dietary restrictions */}
            <div className="space-y-2">
              <Label>Dietary Restrictions</Label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(opt => {
                  const active = profile.dietaryRestrictions?.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleDietaryRestriction(opt.value)}
                      className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-green-600 text-white border-green-600' : 'bg-transparent text-muted-foreground'}`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">Select any that apply</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully!
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="150"
                  placeholder="Enter your age"
                  value={profile.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Years</p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="1"
                  max="500"
                  placeholder="Enter your weight"
                  value={profile.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Kilograms (kg)</p>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="3"
                  placeholder="Enter your height"
                  value={profile.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Meters (m)</p>
              </div>

              {/* Activity Level */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  value={profile.activityLevel}
                  onValueChange={(value) => handleChange("activityLevel", value)}
                >
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">
                      Sedentary - Little or no exercise
                    </SelectItem>
                    <SelectItem value="moderate">
                      Moderate - Light exercise 1-3 days/week
                    </SelectItem>
                    <SelectItem value="active">
                      Active - Moderate exercise 3-5 days/week
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {profile.weight && profile.height && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Your BMI</p>
                <p className="text-2xl font-bold">
                  {((profile.weight / (profile.height * profile.height)).toFixed(1))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(() => {
                    const bmi = profile.weight / (profile.height * profile.height)
                    if (bmi < 18.5) return "Underweight"
                    if (bmi < 25) return "Normal weight"
                    if (bmi < 30) return "Overweight"
                    return "Obese"
                  })()}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={saving}
                style={{ backgroundColor: '#5ea500' }}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

