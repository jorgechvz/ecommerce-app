import { useNavigation, CommonActions } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SuccessScreen({ route }) {
  // Get the navigation object from the useNavigation hook
  const navigation = useNavigation();
  // Get the order object from the route params
  const { order } = route.params;
  // Return the success screen with the order details and a button to continue shopping
  return (
    <View className="flex-1 bg-white items-center justify-between py-10 px-6">
      <View className="flex-col items-center justify-center">
        <Icon name="check-circle" size={100} color="rgb(134, 239, 172)" />
        <Text className="text-2xl font-bold mt-4">It's Ordered</Text>
        <Text className="w-56 text-center">
          Thanks for your order, we hope you enjoyed shopping with us
        </Text>
        <Text className="text-lg mt-2">Order ID: {order.id}</Text>
        <Text className="text-lg mt-2">Total Amount: ${order.total}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "HomeScreen",
                  state: {
                    routes: [{ name: "Home" }],
                  },
                },
              ],
            })
          );
        }}
        className="bg-gray-200 py-3 rounded-lg w-full items-center justify-center"
      >
        <Text className="font-bold text-lg"><Icon name="shopping-bag" size={20} /> Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}
