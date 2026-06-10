import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Meal } from '@/types/mealType';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { likeItem } from "@/reducers/favorites";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface RecipeCardProps {
    meal: Meal;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ meal }) => {
    const dispatch = useAppDispatch();
    const likedMeals = useAppSelector((state) => state.like.meals);
    const mealLiked = likedMeals.find((likedMeal) => likedMeal.idMeal === meal.idMeal);
    const router = useRouter();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        router.push({
            pathname: '/details',
            params: { id: meal.idMeal }
        });
    };

    return (
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
        >
            <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
                <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>{meal.strMeal}</Text>
                    <Text style={styles.category}>{meal.strCategory}</Text>
                </View>

                <TouchableWithoutFeedback onPress={() => dispatch(likeItem(meal))}>
                    <View style={[styles.likeButton, mealLiked ? styles.likeButtonActive : null]}>
                        <Feather
                            name="heart"
                            size={18}
                            color={mealLiked ? "#FFFFFF" : "#64748B"}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginVertical: 10,
        marginHorizontal: 20,
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
    },
    image: {
        width: 110,
        height: 110,
    },
    infoContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
        color: '#0F172A', // Slate 900
        letterSpacing: -0.5,
    },
    category: {
        fontSize: 13,
        color: '#64748B', // Slate 500
        fontWeight: '500',
    },
    likeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 16,
    },
    likeButtonActive: {
        backgroundColor: '#2563EB', // Blue Corporate
        shadowColor: '#2563EB',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    }
});