import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from "react-redux";
import { store } from "@/app/store";

export const unstable_settings = {
    anchor: '(tabs)',
};

// 1. Définition du thème clair Corporate
const CorporateLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#2563EB', // Bleu d'action (Blue 600)
        background: '#F8FAFC', // Fond global (Slate 50)
        card: '#FFFFFF', // Fond des Headers et TabBars
        text: '#0F172A', // Texte principal (Slate 900)
        border: '#F1F5F9', // Bordures discrètes (Slate 100)
        notification: '#EF4444', // Rouge pour les alertes/likes
    },
};

// 2. Définition du thème sombre Corporate (Optionnel, mais prêt à l'emploi)
const CorporateDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#3B82F6', // Bleu un peu plus clair pour le mode sombre
        background: '#0F172A',
        card: '#1E293B',
        text: '#F8FAFC',
        border: '#334155',
        notification: '#EF4444',
    },
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const activeTheme = colorScheme === 'dark' ? CorporateDarkTheme : CorporateLightTheme;

    return (
        <Provider store={store}>
            <ThemeProvider value={activeTheme}>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: activeTheme.colors.card,
                        },
                        headerTintColor: activeTheme.colors.text,
                        headerTitleStyle: {
                            fontWeight: '700',
                            fontSize: 17,
                        },
                        headerShadowVisible: false,
                        contentStyle: {
                            backgroundColor: activeTheme.colors.background,
                        },
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="modal"
                        options={{
                            presentation: 'modal',
                            title: 'Options',
                            animation: 'slide_from_bottom'
                        }}
                    />
                </Stack>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </ThemeProvider>
        </Provider>
    );
}