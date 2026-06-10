import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Meal } from '@/types/mealType';
import { useGetMealQuery } from "@/services/mealAPI";
import { Ionicons } from '@expo/vector-icons';

export default function Details() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data, isLoading, isFetching, error } = useGetMealQuery(id);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeAnim.setValue(0);

        if (!isLoading && !isFetching && data) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading, isFetching, data, fadeAnim, id]);

    if (isLoading || isFetching) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        );
    }

    if (error || !data || !data.meals || data.meals.length === 0) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={styles.errorText}>Impossible de charger la recette.</Text>
                {/* Bouton retour en cas d'erreur */}
                <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
                    <Text style={{ color: '#2563EB', marginTop: 10 }}>Retour</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const meal = data.meals[0];

    const renderIngredients = () => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}` as keyof Meal];
            const measure = meal[`strMeasure${i}` as keyof Meal];

            if (ingredient && typeof ingredient === 'string' && ingredient.trim() !== '') {
                ingredients.push(
                    <View key={i} style={styles.ingredientRow}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.ingredientName}>{ingredient}</Text>
                        <Text style={styles.ingredientMeasure}>{measure}</Text>
                    </View>
                );
            }
        }
        return ingredients;
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

            <TouchableOpacity
                style={[styles.backButton, { top: insets.top + 16 }]}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>

            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                style={{ opacity: fadeAnim }}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{meal.strMeal}</Text>
                    <View style={styles.tagsContainer}>
                        <View style={styles.tag}><Text style={styles.tagText}>{meal.strCategory}</Text></View>
                        <View style={styles.tag}><Text style={styles.tagText}>{meal.strArea}</Text></View>
                    </View>

                    <Text style={styles.sectionTitle}>Ingrédients</Text>
                    <View style={styles.ingredientsContainer}>
                        {renderIngredients()}
                    </View>

                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructions}>{meal.strInstructions}</Text>
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    errorText: { fontSize: 16, color: '#EF4444', fontWeight: '500' },
    errorBackButton: { padding: 10 },

    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },

    scrollContent: { paddingBottom: 40 },
    imageContainer: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    image: {
        width: '100%',
        height: 320,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    contentContainer: { padding: 24 },
    title: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 12, letterSpacing: -0.5 },
    tagsContainer: { flexDirection: 'row', marginBottom: 28 },
    tag: {
        backgroundColor: '#DBEAFE',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
    },
    tagText: { color: '#1D4ED8', fontSize: 13, fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 16, letterSpacing: -0.3 },
    ingredientsContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    ingredientRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6', marginRight: 12 },
    ingredientName: { flex: 1, fontSize: 15, color: '#334155', fontWeight: '500' },
    ingredientMeasure: { fontSize: 15, color: '#0F172A', fontWeight: '700' },
    instructionsContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, elevation: 2 },
    instructions: { fontSize: 15, lineHeight: 26, color: '#475569', textAlign: 'justify' },
});