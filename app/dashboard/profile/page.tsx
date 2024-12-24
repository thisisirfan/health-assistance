'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Save, Activity, TrendingDown, Dumbbell, Heart, Milk, Egg, Wheat, NutIcon as Peanut, Fish, Bean, Nut, AlertTriangle } from 'lucide-react'
import client from '@/api/client'

// Mock user data (in a real app, this would come from a database or API)
const mockUserData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  height: 175,
  weight: 70,
  intolerances: ['dairy', 'gluten'],
  health_goal: 'Stay Fit',
}

const healthGoals = ['Stay Fit', 'Lose Fat', 'Increase Muscle Mass']
const intolerances = [
  "Dairy",
  "Egg",
  "Gluten",
  "Peanut",
  "Wheat",
  "Tree Nut",
  "Soy",
  "Seafood"
]

export default function ProfilePage() {
  const [userData, setUserData] = useState<User>(mockUserData)

  const id = localStorage.getItem('token')
  useEffect(() => {
    if (!id) {
      window.location.href = '/login'
      return;
    }
    client.get(`/auth/profile/` + id).then((res) => setUserData(res.data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleIntoleranceChange = (intolerance: string) => {
    setUserData(prev => ({
      ...prev,
      intolerances: prev.intolerances.includes(intolerance)
        ? prev.intolerances.filter(i => i !== intolerance)
        : [...prev.intolerances, intolerance]
    }))
  }

  const handleHealthGoalChange = (goal: string) => {
    setUserData(prev => ({ ...prev, health_goal: goal }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updated user data:', userData)
    client.put(`/auth/profile/` + id, userData).then((res) => {
      console.log(res.data)
    });
    // Here you would typically send the updated data to your backend
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={userData.age}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={userData.height}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={userData.weight}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Intolerances/Allergens</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {intolerances.map((intolerance) => {
                console.log(intolerance, 'intolerance')
                const Icon = intolerance === "Dairy" ? Milk :
                  intolerance === 'egg' ? Egg :
                    intolerance === 'gluten' || intolerance === 'wheat' ? Wheat :
                      intolerance === 'peanut' ? Peanut :
                        intolerance === 'seafood' || intolerance === 'shellfish' ? Fish :
                          intolerance === 'soy' ? Bean :
                            intolerance === 'tree nut' ? Nut : AlertTriangle;
                return (
                  <Card
                    key={intolerance}
                    className={`cursor-pointer transition-colors ${userData.intolerances.includes(intolerance)
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50"
                      }`}
                    onClick={() => handleIntoleranceChange(intolerance)}
                  >
                    <CardContent className="flex items-center p-2">
                      <Icon className="h-6 w-6 mr-2 text-primary" />
                      <div className="text-sm">
                        <span className="capitalize">{intolerance}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Health Goal</Label>
            <div className="grid grid-cols-2 gap-4">
              {healthGoals.map((goal) => {
                const Icon = goal === 'Stay Fit' ? Activity :
                  goal === 'Lose Fat' ? TrendingDown :
                    goal === 'Increase Muscle Mass' ? Dumbbell : Heart;
                return (
                  <Card
                    key={goal}
                    className={`cursor-pointer transition-colors ${userData.health_goal === goal
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50"
                      }`}
                    onClick={() => handleHealthGoalChange(goal)}
                  >
                    <CardContent className="flex items-center p-4">
                      <Icon className="h-8 w-8 mr-4 text-primary" />
                      <div>
                        <h3 className="font-semibold">{goal}</h3>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

