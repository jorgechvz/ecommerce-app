import { Text, Image, TouchableOpacity, FlatList, View } from "react-native";
import data from "../data/data.json";
import { images } from "../utils/utils";

export default function CategoriesScreen({ navigation }) {
  // get categories from data.json in order alphabetically
  const categories = data.categories.sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  const products = data.products;
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        className="border-1 bg-gray-200 rounded-lg flex-1 mx-2 my-2 w-[210px] h-48 items-center"
        key={item.id}
        onPress={() =>
          navigation.navigate("SubCategory", {
            id: item.id,
            title: item.title,
            name: item.name,
          })
        }
      >
        <Image
          source={images[item.backgroundImage]}
          className="w-full h-[120px] rounded-t-lg"
        />
        <View className="flex-row flex-1 items-center">
          <View>
            <Text className="font-bold text-lg">{item.title}</Text>
            <Text className="text-center">
              {
                products.filter((product) => {
                  if (item.name === "top-sales" && product.stock < 30) {
                    return true;
                  }
                  if (item.name === "popular" && product.rating >= 4.9) {
                    return true;
                  }
                  if (product.category === item.name) {
                    return true;
                  }
                  return false;
                }).length
              }{" "}
              items
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        className="h-[240px] px-2"
        data={categories}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
