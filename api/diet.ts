import client from "@/api/client";

interface GenerateDietRecommendationsResponse {
    recommendations: string[];
}
export const generateDietRecommendations = (userId: number) => client.post<GenerateDietRecommendationsResponse>(`/diet/generate-recommendations/${userId}`);
