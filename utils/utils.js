// Capitalize each word in a string
export const capitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Discount price calculation
export const calculateDiscount = (price, discount) => {
  return price - (price * discount) / 100;
};

export default function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const images = { 
  'smartphone-cat': require("../assets/categories/smartphone-cat.webp"),
  'laptops-cat': require("../assets/categories/laptops-cat.webp"),
  'automotive-cat': require("../assets/categories/automotive-cat.webp"),
  'fragrances-cat': require("../assets/categories/fragrances-cat.webp"),
  'furniture-cat': require("../assets/categories/furniture-cat.webp"),
  'groceries-cat': require("../assets/categories/groceries-cat.webp"),
  'home-decoration-cat': require("../assets/categories/home-decoration-cat.webp"),
  'lightings-cat': require("../assets/categories/lightings-cat.webp"),
  'mens-shirts-cat': require("../assets/categories/mens-shirts-cat.webp"),
  'mens-shoes-cat': require("../assets/categories/mens-shoes-cat.webp"),
  'mens-watches-cat': require("../assets/categories/mens-watches-cat.webp"),
  'motorcycle-cat': require("../assets/categories/motorcycle-cat.webp"),
  'popular-cat': require("../assets/categories/popular-cat.webp"),
  'skincare-cat': require("../assets/categories/skincare-cat.webp"),
  'sunglasses-cat': require("../assets/categories/sunglasses-cat.webp"),
  'top-sales-cat': require("../assets/categories/top-sales-cat.webp"),
  'tops-cat': require("../assets/categories/tops-cat.webp"),
  'womens-shoes-cat': require("../assets/categories/womens-shoes-cat.webp"),
  'womens-watches-cat': require("../assets/categories/womens-watches-cat.webp"),
  'womens-bag-cat': require("../assets/categories/womens-bag-cat.webp"),
  'womens-dresses-cat': require("../assets/categories/womens-dresses-cat.webp"),
  'womens-jewellery-cat': require("../assets/categories/womens-jewellery-cat.webp"),
}