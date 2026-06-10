import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Meal} from "@/types/mealType";

interface APIResponse {
    meals: Meal[];
}

export const mealAPI  = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://www.themealdb.com/api/json/v1/1/'
    }),
    endpoints: (build) => ({
        getMeals: build.query<APIResponse[], void>({
            query: () => 'search.php?s=',
        }),
        getMeal: build.query<APIResponse, string>({
            query: (idMeal) => `lookup.php?i=${idMeal}`,
        }),
        searchMeal: build.query<APIResponse, string>({
            query: (search) => `search.php?s=${search}`,
        }),
        getRandomMeal: build.query<APIResponse, void>({
            query: () => 'random.php'
        })
    }),
});

export const {
    useGetMealsQuery,
    useGetMealQuery,
    useSearchMealQuery,
    useLazyGetRandomMealQuery,
} = mealAPI;