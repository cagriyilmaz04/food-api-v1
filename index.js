const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// TheMealDB API Base URL
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Tariflere eklemek için örnek kısa açıklama ve fiyat
const generateMealDetails = (meal) => ({
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    description: `Delicious ${meal.strMeal} made with fresh ingredients. Perfect for your meal cravings!`,
    price: (Math.random() * 20 + 5).toFixed(2), // Rastgele fiyat (5-25 arası)
});

// Kategoriye göre tarifleri dönen API
app.get("/recipes/:category", async (req, res) => {
    const { category } = req.params;
    try {
        // TheMealDB'den tarifleri al
        const response = await axios.get(`${BASE_URL}/filter.php?i=${category}`);
        const meals = response.data.meals;

        if (meals) {
            // Tariflere kısa açıklama ve fiyat ekle
            const enrichedMeals = meals.map(generateMealDetails);
            res.json(enrichedMeals);
        } else {
            res.status(404).json({ error: "No meals found for this category." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch meals." });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
