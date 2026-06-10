import {combineReducers, configureStore} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FavoritesSlice from "@/reducers/favorites";
import RecipesSlice from "@/reducers/recipes";
import {mealAPI} from "@/services/mealAPI";


const rootReducer = combineReducers({
    like: FavoritesSlice,
    recipes: RecipesSlice,
    [mealAPI.reducerPath]: mealAPI.reducer,
})

const persisted = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        whitelist: [
            'like',
            'recipes'
        ]
    },
    rootReducer,

);

export const store = configureStore({
    reducer: persisted,
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false })
            .concat(mealAPI.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch