import { FlatList } from "react-native";
import SectionHeader from "../SectionHeader";
import shuffleArray from "../../utils/utils";
import renderItem from "../ProductBox";

export default function TopSales({ products, navigation }) {
  // Filter the products with a stock of less than 30 and shuffle the array 
  const data = products.filter((product) => {
    return product.stock < 30;
  });
  shuffleArray(data);
  // Get the first 9 products from the filtered products
  const topSales = data.slice(0, 9);
  const topSaleObject = {
    id: 22,
    title: "Top Sales",
    name: "top-sales",
  };
  // Return the section header and the flatlist with the top sales products
  return (
    <>
      <SectionHeader
        title="Top Sales"
        navRoute={topSaleObject}
        navigation={navigation}
        isNested
      />
      <FlatList
        className="h-[240px] px-2"
        data={topSales}
        horizontal
        renderItem={({ item }) => renderItem({ item, navigation })}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}
