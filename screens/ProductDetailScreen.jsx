import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import data from "../data/data.json";
import RenderCarousel from "../components/RenderCarousel";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import CheckIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { calculateDiscount } from "../utils/utils";

export default function ProductDetail({ route }) {
  // get the product id from the route params
  const { id } = route.params;
  // find the product from the data.json file
  const product = data.products.find((product) => product.id === id);
  const images = product.images;
  // state variables to manage the quantity, adding state, and added state
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  // function to add the product to the cart
  const addToCart = async () => {
    let cart = await AsyncStorage.getItem("cart");
    cart = cart !== null ? JSON.parse(cart) : {};
    const discountedPrice = calculateDiscount(
      product.price,
      product.discountPercentage
    );
    if (id in cart) {
      cart[id].quantity += quantity;
      cart[id].price = discountedPrice;
    } else {
      cart[id] = { ...product, quantity, price: discountedPrice.toFixed(2) };
    }
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  };
  // return the product detail view

  return (
    <View className="flex-1 justify-between">
      <View className="mt-5 mx-2 ">
        <RenderCarousel data={images} />

        <View className="mt-2 px-3">
          <Text className="text-2xl mt-2 font-bold">{product.title}</Text>
          <Text className="text-lg mt-2">{product.brand}</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="font-bold text-2xl">
                $
                {calculateDiscount(
                  product.price,
                  product.discountPercentage
                ).toFixed(2)}
              </Text>
              <Text className="ml-2 text-lg line-through text-red-500">
                ${product.price.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() =>
                  setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))
                }
              >
                <Text>
                  <Icon name="minus-square" size={30} />
                </Text>
              </TouchableOpacity>
              <TextInput
                className="w-10 text-center py-1 font-bold text-md rounded-lgborder-gray-400 "
                editable={false}
                value={String(quantity)}
              />
              <TouchableOpacity
                onPress={() => setQuantity((prevQuantity) => prevQuantity + 1)}
              >
                <Text>
                  <Icon name="plus-square" size={30} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-[15px] text-gray-600 mt-4">
            {product.description}
          </Text>
        </View>
      </View>
      <View className="py-3 px-4 border-t-2 border-gray-200">
        <TouchableOpacity
          onPress={async () => {
            setIsAdding(true);
            await addToCart();
            setTimeout(() => {
              setIsAdding(false);
            }, 1000);
            setIsAdded(true);
            setTimeout(() => {
              setIsAdded(false);
            }, 3000);
          }}
          disabled={isAdding || isAdded}
          className="bg-neutral-950 px-2 py-3 rounded-md flex-row items-center justify-center h-12 w-full"
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : isAdded ? (
            <>
              <CheckIcon
                name="cart-check"
                size={22}
                style={{ color: "white" }}
              />
              <Text className="pl-2 text-white text-center font-bold text-lg">
                Product added to cart
              </Text>
            </>
          ) : (
            <>
              <Icon name="shopping-cart" size={20} style={{ color: "white" }} />
              <Text className="pl-2 text-white text-center font-bold text-lg">
                Add to Cart
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
