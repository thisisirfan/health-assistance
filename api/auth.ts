import client from "@/api/client";

export const getUserData = (userId: number) => client.get<User>(`/auth/profile/` + userId)
