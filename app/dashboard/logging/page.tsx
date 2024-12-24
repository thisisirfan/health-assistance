'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pencil, Trash } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SpeechToText from '@/components/speech-to-text'
import { useCreateFoodLog, useDeleteFoodLog, useGetFoodLogs, useUpdateFoodLog } from '@/hooks/use-food-logs'
import { useToast } from '@/components/ToastProvider'
import { useNutritionAnalysis } from '@/hooks/use-nutrition-analysis'

interface FoodItem {
  id: number
  user_id: number
  food: string
  amount: number
  measurement_scale: string
  meal_time: string
}

const courses = ['breakfast', 'lunch', 'dinner', 'snacks'] as const
const servingUnits = ['grams', 'tbsp', 'pieces', 'cups', 'ml'] as const

export default function FoodLoggingPage() {
  const toast = useToast();
  const [inputValue, setInputValue] = useState('')
  const [servingSize, setServingSize] = useState('')
  const [servingUnit, setServingUnit] = useState<typeof servingUnits[number]>('grams')
  const [selectedCourse, setSelectedCourse] = useState<FoodItem['meal_time']>('breakfast')
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<FoodItem | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [userId, setUserId] = useState<number>()
  const { mutate: createFoodLog } = useCreateFoodLog()
  const { data: foodData, refetch: foodLogRefetch } = useGetFoodLogs(userId);
  const { mutate: updateFoodLog } = useUpdateFoodLog();
  const { mutate: deleteFoodLog } = useDeleteFoodLog();
  const nutritionData = useNutritionAnalysis(foodData)

  useEffect(() => {
    const id = localStorage.getItem('token')
    setUserId(id as unknown as number)
  }, [])

  const handleAddFood = () => {
    if (inputValue.trim() && servingSize) {
      const newItem = {
        user_id: userId,
        food: inputValue.trim(),
        amount: parseInt(servingSize),
        measurement_scale: servingUnit,
        meal_time: selectedCourse,
      }
      createFoodLog(newItem, {
        onSuccess: () => {
          foodLogRefetch()
          toast({
            title: "Food log added",
            description: "Your food log entry has been successfully added.",
          });
        }
      })
      setInputValue('')
      setServingSize('')
    }
  }

  const handleEditSave = () => {
    if (editingItem && inputValue.trim() && servingSize.trim()) {
      const updataItem = {
        food: inputValue.trim(),
        amount: parseInt(servingSize),
        measurement_scale: servingUnit,
        meal_time: selectedCourse,
      }
      updateFoodLog({ id: editingItem.id, data: updataItem }, {
        onSuccess: () => {
          foodLogRefetch();
          toast({
            title: "Food log updated",
            description: "Your food log entry has been successfully updated.",
          });
        }
      });

      setEditingItem(null)
      setInputValue('')
      setServingSize('')
      setSelectedCourse('breakfast')
    }
  }

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item)
    setInputValue(item.food)
    setServingSize(item.amount.toString())
    // Extract serving size and unit from the combined string
    const [size] = item.measurement_scale.split(' ');
    setServingUnit(size as typeof servingUnits[number]);
    setSelectedCourse(item.meal_time)
  }

  const handleDelete = () => {
    if (deleteItem) {
      console.log(deleteItem, 'deleteItem')
      deleteFoodLog(deleteItem.id, {
        onSuccess: () => {
          foodLogRefetch()
          toast({
            title: "Food log deleted",
            description: "Your food log entry has been successfully deleted.",
          })
        }
      })
      setDeleteItem(null)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setIsCalendarOpen(false)
      // In a real app, you would fetch food logs for this date from an API
      // For now, we'll use our mock function
      // setFoodItems(generateMockFoodLogs(date))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Food Logging</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="log" className="space-y-4">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="log" className="rounded-md">Log Food</TabsTrigger>
                <TabsTrigger value="history" className="rounded-md">History</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="log" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Enter what you ate..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFood()}
                  />
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Amount"
                      type="number"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                    />
                    <Select
                      value={servingUnit}
                      onValueChange={(value) => setServingUnit(value as typeof servingUnits[number])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {servingUnits.map((unit) => (
                          <SelectItem key={unit} value={unit} className="capitalize">
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Select
                    value={selectedCourse}
                    onValueChange={(value) => setSelectedCourse(value as FoodItem['meal_time'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course} className="capitalize">
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <SpeechToText setInputValue={setInputValue} />
                </div>
                <Button onClick={editingItem ? handleEditSave : handleAddFood}>
                  {editingItem ? 'Save Changes' : 'Add Food'}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setIsCalendarOpen(true)}
                >
                  {format(selectedDate, 'PPP')}
                </Button>
                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <DialogContent className="sm:max-w-[425px] p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-4"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
          <div className="space-y-2 mt-4">
            {foodData?.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <span className="font-medium">{item.food}</span>
                    <span className="text-muted-foreground">{item.amount} {item.measurement_scale}</span>
                    <span className="capitalize text-muted-foreground">{item.meal_time}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteItem(item)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Macronutrients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Carbs</span>
                  <span>{nutritionData.carbs.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={nutritionData.carbs.percentage} className="h-2" />
                <p className="text-sm text-muted-foreground">{nutritionData.carbs.grams.toFixed(1)}g</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Protein</span>
                  <span>{nutritionData.protein.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={nutritionData.protein.percentage} className="h-2" />
                <p className="text-sm text-muted-foreground">{nutritionData.protein.grams.toFixed(1)}g</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fat</span>
                  <span>{nutritionData.fat.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={nutritionData.fat.percentage} className="h-2" />
                <p className="text-sm text-muted-foreground">{nutritionData.fat.grams.toFixed(1)}g</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calorie Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">
                {nutritionData.calories.toFixed(0)} / 2,000
              </span>
              <span className="text-sm text-muted-foreground">kcal</span>
            </div>
            <Progress value={nutritionData.goalProgress} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground">
              You've consumed {nutritionData.goalProgress.toFixed(0)}% of your daily calorie goal.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteItem?.food}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <style jsx global>{`
        .react-tabs__tab-list {
          border-bottom: none;
          margin-bottom: 1rem;
        }
        .react-tabs__tab {
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease-in-out;
        }
        .react-tabs__tab:first-child {
          border-top-left-radius: 0.5rem;
          border-bottom-left-radius: 0.5rem;
        }
        .react-tabs__tab:last-child {
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .react-tabs__tab--selected {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  )
}

