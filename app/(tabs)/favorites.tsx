import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { RecipeCard } from "@/components/recipeCard";
import { useAppSelector } from "@/app/hooks";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Favorites() {
    const favoriteMeals = useAppSelector(state => state.like.meals);
    const insets = useSafeAreaInsets();

    if (favoriteMeals.length === 0) {
        const centerSafeStyle = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            paddingHorizontal: 20,
            paddingBottom: 20,
            paddingTop: insets.top + 20,
        };

        return (
            <View style={centerSafeStyle}>
                <View style={styles.iconContainer}>
                    <Feather name="heart" size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>Aucun favori</Text>
                <Text style={styles.emptyText}>Vos recettes préférées apparaîtront ici.</Text>
            </View>
        );
    }

    const listContentSafeStyle = {
        paddingTop: insets.top + 16, // existing top padding + top safe area (to handle notch/status bar)
        paddingBottom: insets.bottom + 24, // existing bottom padding + bottom safe area (optional but good practice)
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={favoriteMeals}
                keyExtractor={(item) => item.idMeal}
                contentContainerStyle={listContentSafeStyle}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <RecipeCard meal={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
    emptyText: { fontSize: 15, color: '#64748B', textAlign: 'center' },
});