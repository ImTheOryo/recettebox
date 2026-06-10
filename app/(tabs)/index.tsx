import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";
import { useSearchMealQuery, useLazyGetRandomMealQuery } from "@/services/mealAPI";
import { FlatList, View, StyleSheet, ActivityIndicator, Text, TextInput, TouchableWithoutFeedback, Animated } from "react-native";
import { RecipeCard } from "@/components/recipeCard";
import { Meal } from "@/types/mealType";
import { useDispatch } from "react-redux";
import { addToSearch } from "@/reducers/recipes";
import { Feather } from "@expo/vector-icons";
import {useRouter} from "expo-router";

export default function Meals() {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const randomButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(inputText);
      dispatch(addToSearch(inputText));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputText]);

  const { data, isLoading } = useSearchMealQuery(searchQuery);
  const mealsList: Meal[] = data?.meals || [];

  const [triggerGetRandomMeal, { isLoading: isRandomLoading }] = useLazyGetRandomMealQuery();

  const handleRandomPressIn = () => {
    Animated.spring(randomButtonScale, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handleRandomPressOut = () => {
    Animated.spring(randomButtonScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleRandomPress = async () => {
    try {
      const result = await triggerGetRandomMeal().unwrap();
      const meal = result?.meals?.[0] || null;

      if (meal) {
        router.push({
          pathname: '/details',
          params: { id: meal.idMeal },
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la recette aléatoire:", error);
    }
  };

  const renderContent = () => {
    if (isLoading) return <ActivityIndicator size="large" color="#2563EB" style={styles.center} />;

    if (mealsList.length === 0 && searchQuery.length >= 3) {
      return (
          <View style={styles.center}>
            <Feather name="search" size={48} color="#CBD5E1" style={{marginBottom: 16}} />
            <Text style={styles.emptyText}>Aucune recette trouvée pour &#34;{searchQuery}&#34;.</Text>
          </View>
      );
    }

    return (
        <FlatList
            data={mealsList}
            keyExtractor={(item) => item.idMeal}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <RecipeCard meal={item} />}
        />
    );
  };

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <View style={styles.container}>
          <View style={styles.allSearchContainer}>
            <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
              <Feather name="search" size={20} color={isFocused ? "#2563EB" : "#94A3B8"} style={styles.searchIcon} />
              <TextInput
                  style={styles.searchInput}
                  placeholder="Chercher une recette (ex: chicken)..."
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={setInputText}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
              />
            </View>

            {/* Bouton Random Animé */}
            <TouchableWithoutFeedback
                onPressIn={handleRandomPressIn}
                onPressOut={handleRandomPressOut}
                onPress={handleRandomPress}
            >
              <Animated.View style={[styles.randomButton, { transform: [{ scale: randomButtonScale }] }]}>
                <Feather name="shuffle" size={20} color="#FFFFFF" />
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>

          {renderContent()}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  allSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchContainerFocused: {
    borderColor: '#2563EB',
    shadowOpacity: 0.1,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, height: 54, color: '#0F172A', fontSize: 16 },

  randomButton: {
    width: 54,
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: { textAlign: 'center', fontSize: 16, color: '#64748B', fontWeight: '500' },
});