/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NUTRITIONIX_API_KEY: process.env.NUTRITIONIX_API_KEY,
        NUTRITIONIX_APP_ID: process.env.NUTRITIONIX_APP_ID,
        NUTRITIONIX_API_BASE: process.env.NUTRITIONIX_API_BASE,
        BACKEND_URL: process.env.BACKEND_URL,
    }
};

export default nextConfig;
