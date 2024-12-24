"use client";
import { generateDietRecommendations } from "@/api/diet";
import { useQuery } from "@tanstack/react-query";


export const useGenerateDietRecommendations = (id: number | undefined) => {
    return useQuery({
        queryKey: ['get-diet-recommendations', id],
        queryFn: async () => {
            if (!id) return;
            const response = await generateDietRecommendations(id);
            return response.data.recommendations;
        },
        enabled: !!id,
    });
};
