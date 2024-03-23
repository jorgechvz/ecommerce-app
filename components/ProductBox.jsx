import { Image, Text, TouchableOpacity, View } from "react-native";
import { calculateDiscount, capitalize } from "../utils/utils";

const renderItem = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      className="border-1 bg-gray-200 rounded-lg flex-1 mx-[6px] my-2 w-[210px]"
      onPress={() => {
        navigation.navigate("ProductDetail", { id: item.id, name: capitalize(item.title) });
      }}
    >
      <Image
        source={{ uri: item.images[0] }}
        className="w-full h-[140px] rounded-t-lg"
      />
      <View className="p-2 flex-col">
        <Text className="text-[14px] mb-1">{capitalize(item.title)}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-lg">
            ${calculateDiscount(item.price, item.discountPercentage).toFixed(2)}
          </Text>
          <Text className="line-through text-red-500">
            ${item.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default renderItem;
