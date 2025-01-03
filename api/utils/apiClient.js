import axios from "axios";

const GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const API_KEY = process.env.GOOGLE_API_KEY;  // Ensure you set your Google Places API key

// Fetch restaurants from Google Places API
export const fetchRestaurantsFromGooglePlaces = async ({ location, term, price, dietaryRestrictions }) => {
    try {
        const response = await axios.get(GOOGLE_PLACES_API_URL, {
            params: {
                location: `${location.lat},${location.lon}`, // Latitude and longitude of the location
                radius: 1500, // Radius around the location in meters
                type: "restaurant", // Only restaurants
                keyword: term, // Search term (e.g., "vegan", "Italian")
                price_level: price, // Price level filter (Google uses 0–4 scale)
                key: API_KEY, // API key
            },
        });

        return response.data.results.map((r) => ({
            name: r.name,
            location: r.vicinity, // Address of the restaurant
            rating: r.rating,
            price: r.price_level, // Google Places API returns price level (0–4)
        }));
    } catch (error) {
        console.error("Error fetching data from Google Places API:", error.message);
        throw new Error("Failed to fetch data from Google Places API");
    }
};
