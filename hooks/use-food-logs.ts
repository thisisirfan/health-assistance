"use client";

import { createFoodLog, deleteFoodLog, getFoodLog, getFoodLogs, updateFoodLog } from "@/api/food-logs";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateFoodLog = () => {
    return useMutation({
        mutationFn: createFoodLog,
    });
};

export const useGetFoodLogs = (userId: number | undefined) => {
    return useQuery({
        queryKey: ['get-food-logs', userId],
        queryFn: async () => {
            if (!userId) return;
            const response = await getFoodLogs(userId);
            return response.data;
        },
        enabled: !!userId,
    });
};

export const useGetFoodLog = (id: number | undefined) => {
    return useQuery({
        queryKey: ['get-food-log', id],
        queryFn: async () => {
            if (!id) return;
            const response = await getFoodLog(id);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useUpdateFoodLog = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: Object }) => updateFoodLog(id, data),
    });
};

export const useDeleteFoodLog = () => {
    return useMutation({
        mutationFn: deleteFoodLog,
    });
};

