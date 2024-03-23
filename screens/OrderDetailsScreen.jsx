import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cardsTypes } from "./PaymentScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import ShippingIcon from "react-native-vector-icons/FontAwesome5";
import CardIcon from "react-native-vector-icons/Fontisto";
import { useNavigation } from "@react-navigation/native";

export default function OrderDetailsScreen() {
  const navigation = useNavigation();
  // State variables to manage the loading state, payment details, shipping details, address details, and cart details
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [shippingDetails, setShippingDetails] = useState(null);
  const [addressDetails, setAddressDetails] = useState(null);
  const [cartDetails, setCartDetails] = useState({});
  // Function to handle the confirm order button click event and remove the cart, payment details, shipping details, and address details from the async storage
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const [cart, paymentDetails, shipping, address] = await Promise.all([
        AsyncStorage.getItem("cart"),
        AsyncStorage.getItem("paymentDetails"),
        AsyncStorage.getItem("shipping"),
        AsyncStorage.getItem("OrderAddress"),
      ]);
      if (cart !== null) {
        setCartDetails(JSON.parse(cart));
      }
      if (paymentDetails !== null) {
        setPaymentDetails(JSON.parse(paymentDetails));
      }
      if (shipping !== null) {
        setShippingDetails(JSON.parse(shipping));
      }
      if (address !== null) {
        setAddressDetails(JSON.parse(address));
      }
      setTimeout(() => setIsLoading(false), 2000);
    };

    fetchPaymentDetails();
  }, []);
  // isLoading state is true, show the loading indicator with the text "Loading ..."
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 font-bold text-lg">Loading ...</Text>
      </View>
    );
  }
  // Calculate the cart length, subtotal amount, shipping amount, tax amount, and total amount
  const cartLength = Object.keys(cartDetails).length;
  const subtotalAmount = Object.values(cartDetails)
    .reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
    .toFixed(2);
  const shippingAmount = shippingDetails.price.toFixed(2);
  const taxAmount = (
    (parseFloat(subtotalAmount) + parseFloat(shippingAmount)) *
    0.05
  ).toFixed(2);
  const totalAmount = (
    parseFloat(subtotalAmount) +
    parseFloat(shippingAmount) +
    parseFloat(taxAmount)
  ).toFixed(2);

  const address = addressDetails.address;
  let deliveryTime = "";
  if (shippingDetails.name === "Standard Shipping") {
    deliveryTime = `2 weeks for $ ${shippingAmount}`;
  } else if (shippingDetails.id === "Express Shipping") {
    deliveryTime = `3 days for $ ${shippingAmount}`;
  } else {
    deliveryTime = `1 month for $ ${shippingAmount}`;
  }
  const cardTitle = cardsTypes.find(
    (card) => card.name === paymentDetails.cardType
  )?.title;

  const cardNumber = paymentDetails.cardNumber.slice(-4);
  const maskedCardNumber = "**** " + cardNumber;
  // Function to handle the confirm order button click event and remove the cart, payment details, shipping details, and address details from the async storage
  const confirmOrderButtonHandler = async () => {
    await Promise.all([
      AsyncStorage.removeItem("cart"),
      AsyncStorage.removeItem("paymentDetails"),
      AsyncStorage.removeItem("shipping"),
      AsyncStorage.removeItem("OrderAddress"),
    ]);
    navigation.navigate("SuccessScreen", {
      order: {
        id: Math.floor(Math.random() * 1000),
        total: totalAmount,
      },
    });
  };
  // Return the order details screen with the cart, address, shipping, and payment details
  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="mb-10">
          <Text className="mt-7 mx-4 font-bold text-xl mb-3">
            Checkout Info
          </Text>
          <View className="mx-2">
            <View className="flex-row items-center">
              <View className="space-y-2 bg-gray-200 flex-1 h-36 items-center justify-center m-2 rounded-lg">
                <Icon name="shopping-cart" size={40} />
                <Text className="font-bold">Cart</Text>
                <Text>{cartLength} items</Text>
                <Text>$ {subtotalAmount}</Text>
              </View>
              <View className="space-y-2 bg-gray-200 flex-1 h-36 items-center justify-center m-2 rounded-lg">
                <Icon name="home" size={40} />
                <Text className="font-bold">Address</Text>
                <Text className="px-5 text-center">{address}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="space-y-2 bg-gray-200 flex-1 h-36 items-center justify-center m-2 rounded-lg">
                <ShippingIcon name="shipping-fast" size={35} />
                <Text className="font-bold">Shipping</Text>
                <Text>{shippingDetails.name}</Text>
                <Text>{deliveryTime}</Text>
              </View>
              <View className="space-y-2 bg-gray-200 flex-1 h-36 items-center justify-center m-2 rounded-lg">
                <CardIcon name={paymentDetails.cardType} size={35} />
                <Text className="font-bold">Payment</Text>
                <Text>{cardTitle}</Text>
                <Text>{maskedCardNumber}</Text>
              </View>
            </View>
          </View>
          <View className="mx-2 mt-4">
            <View className="mx-2 bg-gray-200 p-3 rounded-lg space-y-2">
              <View className="flex-row items-center">
                <Text className="flex-1 mx-2 text-lg">Subtotal</Text>
                <Text className="mx-2 text-lg">$ {subtotalAmount}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="flex-1 text-lg mx-2">Shipping</Text>
                <Text className="mx-2 text-lg">$ {shippingAmount}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="flex-1 text-lg mx-2">Tax</Text>
                <Text className="mx-2 text-lg">$ {taxAmount}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="flex-1 mx-2 mt-5 font-bold text-xl">
                  Total
                </Text>
                <Text className="mx-2 font-bold text-xl">$ {totalAmount}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="border-t-2 px-4 py-3 border-slate-300">
          <Text className="text-center mb-2">
            By pressing confirm order, your agree to our{" "}
            <Text className="font-bold">Terms</Text> and{" "}
            <Text className="font-bold">Privacy</Text>
          </Text>
          <TouchableOpacity
            className="bg-black py-2 mt-2 rounded-lg px-4"
            onPress={confirmOrderButtonHandler}
          >
            <View className="flex-row items-center justify-center">
              <Icon name="check-circle" size={20} color={"white"} />
              <Text className="ml-2 text-white font-bold text-lg">
                Confirm Order
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
