interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    height: number;
    weight: number;
    intolerances: string[],
    health_goal: string;

}

interface FoodLog {
    id: number;
    user_id: number;
    food: string;
    amount: number;
    measurement_scale: string;
    meal_time: string;
}

interface UserMeal {
    id: number;
    user_id: number;
    recipe: Recipe;
    meal_time: string;
    timestamp: string;
}

interface Recipe {
    id: number;
    recipe: string;
    ingredients: string;
    instructions: string;
    cuisine: string;
    course: string;
    difficulty: string;
    servings: number;
    diet: string;
    url: string;
}
