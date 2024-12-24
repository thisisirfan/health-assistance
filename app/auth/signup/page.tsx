'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'

const steps = ['User Info', 'Physical Attributes', 'Intolerances', 'Health Goal']

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className={cn(
                "flex flex-col items-center",
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2",
                index <= currentStep ? "border-primary" : "border-muted-foreground"
              )}>
                {index + 1}
              </div>
              <span className="text-xs">{step}</span>
            </div>
          ))}
        </div>
        {currentStep === 0 && <UserInfoStep />}
        {currentStep === 1 && <PhysicalAttributesStep />}
        {currentStep === 2 && <IntolerancesStep />}
        {currentStep === 3 && <HealthGoalStep />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
          Back
        </Button>
        <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function UserInfoStep() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <div className="relative">
          <Icons.User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="name" placeholder="Enter your name" className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Icons.Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="email" type="email" placeholder="Enter your email" className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Icons.Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="password" type="password" placeholder="Create a password" className="pl-10" />
        </div>
      </div>
    </div>
  )
}

function PhysicalAttributesStep() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <div className="relative">
          <Icons.Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="age" type="number" placeholder="Enter your age" className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="height">Height (cm)</Label>
        <div className="relative">
          <Icons.Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="height" type="number" placeholder="Enter your height" className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <div className="relative">
          <Icons.Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="weight" type="number" placeholder="Enter your weight" className="pl-10" />
        </div>
      </div>
    </div>
  )
}

function IntolerancesStep() {
  const intolerances = [
    { name: 'Dairy', icon: Icons.Milk },
    { name: 'Gluten', icon: Icons.Wheat },
    { name: 'Nuts', icon: Icons.Nut },
    { name: 'Eggs', icon: Icons.Egg },
    { name: 'Soy', icon: Icons.Soy },
    { name: 'Fish', icon: Icons.Fish },
    { name: 'Shellfish', icon: Icons.Shellfish },
    { name: 'Peanuts', icon: Icons.Peanut },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {intolerances.map((intolerance) => (
        <Button
          key={intolerance.name}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-2"
        >
          <intolerance.icon className="h-8 w-8" />
          <span>{intolerance.name}</span>
        </Button>
      ))}
    </div>
  )
}

function HealthGoalStep() {
  const goals = [
    { name: 'Stay Fit', icon: Icons.Dumbbell },
    { name: 'Lose Fat', icon: Icons.Scale },
    { name: 'Increase Muscle Mass', icon: Icons.Biceps },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {goals.map((goal) => (
        <Button
          key={goal.name}
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-4"
        >
          <goal.icon className="h-12 w-12" />
          <span>{goal.name}</span>
        </Button>
      ))}
    </div>
  )
}

