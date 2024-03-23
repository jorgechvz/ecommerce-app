import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SectionHeader({
  title,
  navRoute,
  navigation,
  isNested,
}) {
  // Function to handle the press event on the view all button
  const handlePress = () => {
    if (isNested) {
      navigation.navigate("SubCategory", navRoute);
    } else {
      navigation.navigate(navRoute);
    }
  };

  return (
    <View className="flex-row justify-between items-center mt-5 mx-2 p-2">
      <Text className="text-[16px]">{title}</Text>
      <TouchableOpacity
        className="flex-row justify-between items-center gap-2"
        onPress={handlePress}
      >
        <Text className="text-[16px]">View all</Text>
        <Icon name="angle-right" size={28} />
      </TouchableOpacity>
    </View>
  );
}
