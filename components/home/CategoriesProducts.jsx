import { FlatList, Text, TouchableOpacity } from "react-native";
import data from "../../data/data.json";
import SectionHeader from "../SectionHeader";

const categories = data.categories;

export default function CategoriesProducts({ navigation }) {
  const category = categories.slice(0, 4);
  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex-1 p-3 m-1 bg-gray-200 rounded-md"
      onPress={() => {
        navigation.navigate("SubCategory", {
          id: item.id,
          title: item.title,
          name: item.name,
        });
      }}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );
  return (
    <>
      <SectionHeader
        title="Categories"
        navRoute="Categories"
        navigation={navigation}
      />
      <FlatList
        className="mt-2 px-2"
        scrollEnabled={false}
        numColumns={2}
        data={category}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}
