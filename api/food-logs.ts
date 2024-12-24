import client from "@/api/client";

interface CreateFoodLog {
    user_id: number | undefined;
    food: string;
    amount: number;
    measurement_scale: string;
    meal_time: string;
}

export const createFoodLog = (data: CreateFoodLog) => client.post<FoodLog>(`/food-logs/`, data);
export const getFoodLogs = (userId: number) => client.get<FoodLog[]>(`/food-logs/`, {
    params: {
        user_id: userId,
    },
});
export const getFoodLog = (id: number) => client.get<FoodLog>(`/food-logs/${id}`);
export const updateFoodLog = (id: number, data: Partial<CreateFoodLog>) => client.put<FoodLog>(`/food-logs/${id}`, data);
export const deleteFoodLog = (id: number) => client.delete<FoodLog>(`/food-logs/${id}`);
