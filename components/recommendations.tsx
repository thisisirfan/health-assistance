"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGenerateDietRecommendations } from "@/hooks/use-diet"
import { useEffect, useState } from "react"

export function Recommendations() {
  const [userId, setUserId] = useState<number>()
  const { data: recommendations } = useGenerateDietRecommendations(userId)
  useEffect(() => {
    const id = localStorage.getItem('token')
    setUserId(id as unknown as number)
  }, [])
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recommendations?.map((rec, index) => {
            return (
              <div key={index} className='flex items-start p-2 rounded-md'>
                <p className="text-md">{rec}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

