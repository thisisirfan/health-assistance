import client from "@/api/client";

interface CreateUserMeal {
    user_id: number;
    recipe_id: string;
    meal_time: string;
    week_day: string;
}

export const createUserMeal = (data: CreateUserMeal) => client.post<UserMeal>(`/user-meals/`, data);
export const getUserMeals = (userId: number, weekDay: string) => client.get<UserMeal[]>(`/user-meals/`, {
    params: {
        user_id: userId, week_day: weekDay,
    },
});
export const getUserMeal = (id: number) => client.get<UserMeal>(`/user-meals/${id}`);
export const updateUserMeal = (id: number, data: Partial<CreateUserMeal>) => client.put<UserMeal>(`/user-meals/${id}`, data);
export const deleteUserMeal = (id: number) => client.delete<UserMeal>(`/user-meals/${id}`);
