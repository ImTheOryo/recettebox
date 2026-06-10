import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";

interface SearchResult {
    id: string;
    search: string;
}

interface RecipesState {
    search: SearchResult[];
}

const initialState: RecipesState = { search: [] };

export const RecipesSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {
        addToSearch: (state, action: PayloadAction<string>) => {
            const newSearch: SearchResult = {
                id: nanoid(),
                search: action.payload,
            }
            state.search = [newSearch, ...state.search];
        },
        removeFromSearch: (state, action: PayloadAction<string>) => {
            state.search = state.search.filter((search) => search.id !== action.payload);
        }
    }
});

export const { addToSearch, removeFromSearch } = RecipesSlice.actions;
export default RecipesSlice.reducer;