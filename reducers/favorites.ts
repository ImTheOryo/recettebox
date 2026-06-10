import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Meal} from "@/types/mealType";

interface FavoritesMealState {
    meals: Meal[];
}

const initialState: FavoritesMealState = { meals: [] };

export const FavoritesSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {
        likeItem: (state, action: PayloadAction<Meal>) => {
            const findItem = state.meals.find((it) => it.idMeal === action.payload.idMeal);
            if (!findItem) {
                state.meals.push(action.payload);
            } else {
                state.meals = state.meals.filter(it => it.idMeal !== action.payload.idMeal);
            }
        },
    }
});

export const { likeItem } = FavoritesSlice.actions;
export default FavoritesSlice.reducer;