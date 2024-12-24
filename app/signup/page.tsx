'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/icons'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import client from '@/api/client'
import { LucideProps } from 'lucide-react'

const steps = [
  { name: 'Basic Info', icon: (props: LucideProps) => <Icons.User {...props} /> },
  { name: 'Physical Attributes', icon: (props: LucideProps) => <Icons.Ruler {...props} /> },
  { name: 'Intolerances', icon: (props: LucideProps) => <Icons.AlertTriangle {...props} /> },
  { name: 'Health Goal', icon: (props: LucideProps) => <Icons.Target {...props} /> }
]

const intolerances = [
  { name: 'Dairy', icon: (props: LucideProps) => <Icons.Milk {...props} /> },
  { name: 'Egg', icon: (props: LucideProps) => <Icons.Egg {...props} /> },
  { name: 'Gluten', icon: (props: LucideProps) => <Icons.Wheat {...props} /> },
  { name: 'Peanut', icon: (props: LucideProps) => <Icons.Peanut {...props} /> },
  { name: 'Seafood', icon: (props: LucideProps) => <Icons.Fish {...props} /> },
  { name: 'Soy', icon: (props: LucideProps) => <Icons.Bean {...props} /> },
  { name: 'Tree Nut', icon: (props: LucideProps) => <Icons.Nut {...props} /> },
  { name: 'Wheat', icon: (props: LucideProps) => <Icons.Wheat {...props} /> }
]

const healthGoals = [
  { name: 'Stay Fit', icon: (props: LucideProps) => <Icons.Activity {...props} />, description: 'Maintain current fitness level' },
  { name: 'Lose Fat', icon: (props: LucideProps) => <Icons.TrendingDown {...props} />, description: 'Reduce body fat percentage' },
  { name: 'Gain Muscle', icon: (props: LucideProps) => <Icons.Dumbbell {...props} />, description: 'Increase muscle mass and strength' },
  { name: 'Improve Health', icon: (props: LucideProps) => <Icons.Heart {...props} />, description: 'Focus on overall well-being' }
]

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    intolerances: [] as string[],
    healthGoal: ''
  })

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIntoleranceChange = (intolerance: string) => {
    setFormData(prev => ({
      ...prev,
      intolerances: prev.intolerances.includes(intolerance)
        ? prev.intolerances.filter(i => i !== intolerance)
        : [...prev.intolerances, intolerance]
    }))
  }

  const handleHealthGoalChange = (goal: string) => {
    setFormData(prev => ({ ...prev, healthGoal: goal }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep === steps.length - 1) {
      console.log('Form submitted:', formData)

      const response = await client.post('/auth/register', formData)

      localStorage.setItem('token', response.data.id)

      // Here you would typically send the data to your backend
      // After successful signup, redirect to dashboard
      router.push('/dashboard')
    } else {
      nextStep()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Create Your Account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="mb-8">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.name}
                    className={cn(
                      "flex flex-col items-center",
                      index <= currentStep ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2",
                        index <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                      )}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    {Icons.User && <Icons.User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    {Icons.Mail && <Icons.Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    {Icons.Lock && <Icons.Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <div className="relative">
                    {Icons.Calendar && <Icons.Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <div className="relative">
                    {Icons.Ruler && <Icons.Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <div className="relative">
                    {Icons.Scale && <Icons.Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Label>Intolerances/Allergens</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {intolerances.map((intolerance) => (
                    <div key={intolerance.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={intolerance.name}
                        checked={formData.intolerances.includes(intolerance.name)}
                        onCheckedChange={() => handleIntoleranceChange(intolerance.name)}
                      />
                      <Label htmlFor={intolerance.name} className="flex items-center space-x-2">
                        {intolerance.icon && intolerance.icon({className: "h-4 w-4"})}
                        <span>{intolerance.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>Health Goal</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthGoals.map((goal) => (
                    <Card
                      key={goal.name}
                      className={cn(
                        "cursor-pointer transition-colors",
                        formData.healthGoal === goal.name
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => handleHealthGoalChange(goal.name)}
                    >
                      <CardContent className="flex items-center p-4">
                        {goal.icon && goal.icon({className: "h-8 w-8 mr-4 text-primary"})}
                        <div>
                          <h3 className="font-semibold">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            <Button type="submit">
              {currentStep === steps.length - 1 ? 'Create Account' : 'Next'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

