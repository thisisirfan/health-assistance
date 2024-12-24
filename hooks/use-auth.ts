"use client";
import { getUserData } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";


export const useUserData = (id: number | undefined) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            if (!id) return;
            const response = await getUserData(id);
            return response.data;
        },
        enabled: !!id
    });
};
