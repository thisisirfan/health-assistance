import { createUserMeal, deleteUserMeal, getUserMeal, getUserMeals, updateUserMeal } from "@/api/user-meals";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useCreateUserMeal = () => {
    return useMutation({
        mutationFn: createUserMeal,
    });
}

export const useGetUserMeals = (userId: number | undefined, weekDay: string) => {
    return useQuery({
        queryKey: ['get-user-meals', userId, weekDay],
        queryFn: async () => {
            if (!userId || !weekDay) return;
            const response = await getUserMeals(userId, weekDay);
            return response.data;
        },
        enabled: !!userId,
    });
}

export const useGetUserMeal = (id: number | undefined) => {
    return useQuery({
        queryKey: ['get-user-meal', id],
        queryFn: async () => {
            if (!id) return;
            const response = await getUserMeal(id);
            return response.data;
        },
        enabled: !!id,
    });
}
export const useUpdateUserMeal = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: Object }) => updateUserMeal(id, data),
    });
}

export const useDeleteUserMeal = () => {
    return useMutation({
        mutationFn: deleteUserMeal,
    });
}
