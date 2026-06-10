import {combineReducers, configureStore} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from "@react-native-async-storage/async-storage";


const rootReducer = combineReducers({

})

const persisted = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        whitelist: [
            'cart',
            'like'
        ]
    },
    rootReducer,
);

export const store = configureStore({
    reducer: persisted,
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;