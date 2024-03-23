import { FlatList, Image, Text, View } from "react-native";
import shuffleArray, { calculateDiscount, capitalize } from "../../utils/utils";
import SectionHeader from "../SectionHeader";
import renderItem from "../ProductBox";

export default function PopularProducts({ products, navigation }) {
  // Filter the products with a rating of 4.9 or higher and shuffle the array 
  const filteredProducts = products.filter((product) => product.rating >= 4.9);
  shuffleArray(filteredProducts);
  // Get the first 9 products from the filtered products 
  const popularProducts = filteredProducts.slice(0, 9);
  const popularObject = {
    id: 21,
    title: "Popular",
    name: "popular",
  };
  
  return (
    <>
      <SectionHeader
        title="Popular Products"
        navRoute={popularObject}
        navigation={navigation}
        isNested
      />
      <FlatList
        className="h-[240px] px-2"
        horizontal
        data={popularProducts}
        renderItem={({ item }) => renderItem({ item, navigation })}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}
