import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import SadIcon from "react-native-vector-icons/FontAwesome6";

export default function CartScreen({ navigation }) {
  // Use state to keep track of the cart
  const [cart, setCart] = useState({});
  // Create a loading state to show a loading indicator while fetching the cart
  const [loading, setLoading] = useState(true);
  // Use useEffect to fetch the cart from AsyncStorage when the screen is focused
  useEffect(() => {
    const fetchCart = async () => {
      let cart = await AsyncStorage.getItem("cart");
      cart = cart !== null ? JSON.parse(cart) : {};
      setCart(cart);
    };
    // Use the navigation prop to add a listener for the focus event
    const unsubscribe = navigation.addListener("focus", fetchCart);
    // Set loading to false after fetching the cart
    setTimeout(() => setLoading(false), 2000);
    // Return the unsubscribe function to remove the listener when the component is unmounted
    return unsubscribe;
  }, [navigation]);
  // Create a function to remove an item from the cart and update AsyncStorage
  const removeFromCart = async (id) => {
    let newCart = { ...cart };
    delete newCart[id];
    setCart(newCart);
    await AsyncStorage.setItem("cart", JSON.stringify(newCart));
  };
  // Create a function to clear the cart and update AsyncStorage
  const clearCart = async () => {
    await AsyncStorage.setItem("cart", JSON.stringify({}));
    setCart({});
  };
  // Use useEffect to set the header options for the screen
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="mr-3" onPress={clearCart}>
          <Icon name="trash" size={30} style={{ color: "#007AFF" }} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
          <View className="flex-row items-center ml-3">
            <Icon name="angle-left" size={30} style={{ color: "#007AFF" }} />
            <Text className="text-[#007AFF] text-lg ml-2">Shop</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const updateQuantity = async (id, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[id].quantity = newQuantity;
      return updatedCart;
    });
    // Wait for the next render cycle when the state has been updated
    setTimeout(async () => {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
    }, 0);
  };

  // Create a function to render each item in the FlatList
  const renderItem = ({ item }) => (
    <View className="rounded-lg border-1 bg-gray-200 mb-3 p-3">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.images[0] }}
          style={{ width: 100, height: 100, borderRadius: 10 }}
        />
        <View className="p-2 space-y-1 w-64 mx-3">
          <Text className="font-bold text-lg">{item.title}</Text>
          <Text>{item.brand}</Text>
          <Text className="font-bold text-[15px]">${item.price}</Text>
        </View>
      </View>
      <View className="flex-row justify-between mt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() =>
              updateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
          >
            <Text>
              <Icon name="minus-square" size={30} />
            </Text>
          </TouchableOpacity>
          <TextInput
            className="w-30 text-center py-1 mx-24 font-bold text-md rounded-lg"
            editable={false}
            value={String(item.quantity) + " item"}
          />
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text>
              <Icon name="plus-square" size={30} />
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Icon name="trash" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if(loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }     

  // Return the FlatList component with the renderItem function
  return (
    <View className="flex-1 justify-center bg-white">
      {Object.keys(cart).length === 0 ? (
        <View className="flex-1 justify-center items-center gap-y-4">
          <SadIcon name="face-sad-cry" size={120} />
          <Text className="font-bold text-lg">Your cart is empty</Text>
          <Button
            title="Shop now"
            onPress={() => navigation.navigate("Categories")}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <FlatList
            className="mx-4 my-3"
            data={Object.values(cart)}
            renderItem={renderItem}
            keyExtractor={(item) => (item.id ? item.id.toString() : "")}
          />
          <View className="px-4 py-3 border-t-2 border-slate-300">
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg">Total</Text>
              <View className="flex-row items-center">
                <Text className="mr-2">
                  for {Object.keys(cart).length} items
                </Text>
                <Text className="font-bold text-lg">
                  ${" "}
                  {Object.values(cart)
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toFixed(2)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-black py-2 mt-2 rounded-lg justify-center items-center"
              onPress={() => navigation.navigate("Shipping")}
            >
              <View className="flex-row items-center">
                <Icon name="credit-card" size={20} color={"white"} />
                <Text className="ml-2 text-white text-center font-bold text-lg">
                  Checkout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
