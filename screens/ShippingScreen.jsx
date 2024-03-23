import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckBox } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ShippingScreen() {
  const navigation = useNavigation();
  const [checked, setChecked] = useState({
    "Free Shipping": false,
    "Standard Shipping": false,
    "Express Shipping": false,
  });
  const [shippingOption, setShippingOption] = useState(null);

  const toggleCheckbox = (option) => {
    setChecked({
      "Free Shipping": false,
      "Standard Shipping": false,
      "Express Shipping": false,
      [option.name]: true,
    });
    setShippingOption(option);
  };

  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart !== null) {
        setCart(JSON.parse(storedCart));
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchShippingOption = async () => {
      const storedShippingOption = await AsyncStorage.getItem("shipping");
      if (storedShippingOption !== null) {
        const parsedOption = JSON.parse(storedShippingOption);
        setShippingOption(parsedOption);
        setChecked({
          "Free Shipping": false,
          "Standard Shipping": false,
          "Express Shipping": false,
          [parsedOption.name]: true,
        });
      }
    };
    fetchShippingOption();
  }, []);
  const continueHandler = async () => {
    if (shippingOption !== null) {
      await AsyncStorage.setItem("shipping", JSON.stringify(shippingOption));
      navigation.navigate("Address");
    } else {
      alert("Please select a shipping method");
    }
  };
  const shippingDate = new Date();
  shippingDate.setMonth(shippingDate.getMonth() + 1);
  const standardDate = new Date();
  standardDate.setDate(standardDate.getDate() + 14);
  const expressDate = new Date();
  expressDate.setDate(expressDate.getDate() + 3);
  return (
    <View className="flex-1 justify-between mb-5 bg-white">
      <View className="m-4">
        <Text className="font-bold text-lg mb-3">Select shipping method</Text>
        <View className="rounded-lg bg-gray-200 p-3 mb-3">
          <TouchableOpacity
            className="flex-row items-center justify-between w-full"
            onPress={() =>
              toggleCheckbox({ name: "Free Shipping", price: 0.0 })
            }
          >
            <View className="space-y-1">
              <Text className="font-bold text-lg">Free Shipping</Text>
              <Text>
                <Icon name="calendar" size={12} /> 1 month -{" "}
                {shippingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text className="font-bold text-lg">Free</Text>
            </View>
            <CheckBox
              checked={checked["Free Shipping"]}
              textStyle={{ fontWeight: "bold" }}
              checkedIcon="check-circle"
              uncheckedIcon="circle"
              checkedColor="green"
              size={25}
              containerStyle={{ backgroundColor: "transparent", width: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View className="rounded-lg bg-gray-200 p-3 mb-3">
          <TouchableOpacity
            className="flex-row items-center justify-between w-full"
            onPress={() =>
              toggleCheckbox({ name: "Standard Shipping", price: 4.7 })
            }
          >
            <View className="space-y-1">
              <Text className="font-bold text-lg">Standard Shipping</Text>
              <Text>
                <Icon name="calendar" size={12} /> 2 weeks -{" "}
                {standardDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text className="font-bold text-lg">$ 4.70</Text>
            </View>
            <CheckBox
              textStyle={{ fontWeight: "bold" }}
              checked={checked["Standard Shipping"]}
              checkedIcon="check-circle"
              uncheckedIcon="circle"
              checkedColor="green"
              size={25}
              containerStyle={{ backgroundColor: "transparent", width: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View className="rounded-lg bg-gray-200 p-3 mb-3">
          <TouchableOpacity
            className="flex-row items-center justify-between w-full"
            onPress={() =>
              toggleCheckbox({ name: "Express Shipping", price: 30.0 })
            }
          >
            <View className="space-y-1">
              <Text className="font-bold text-lg">Express Shipping</Text>
              <Text>
                <Icon name="calendar" size={12} /> 3 days -{" "}
                {expressDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text className="font-bold text-lg">$ 30.00</Text>
            </View>

            <CheckBox
              textStyle={{ fontWeight: "bold" }}
              checked={checked["Express Shipping"]}
              checkedIcon="check-circle"
              uncheckedIcon="circle"
              checkedColor="green"
              size={25}
              containerStyle={{ backgroundColor: "transparent", width: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text className="font-bold text-lg my-3">Order Info</Text>
          <View className="bg-gray-200 p-3 space-y-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-[15px]">Subtotal</Text>
              <Text className="font-bold text-[15px]">
                ${" "}
                {Object.values(cart)
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[15px]">Shipping</Text>
              <Text className="font-bold text-[15px]">
                {shippingOption
                  ? `$ ${shippingOption.price.toFixed(2)}`
                  : "$ 0.00"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="font-bold text-lg">
                ${" "}
                {(
                  Object.values(cart).reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  ) + (shippingOption ? shippingOption.price : 0.0)
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="mx-4">
        <Text>Next Step: Order Info</Text>
        <TouchableOpacity
          className="bg-black py-2 mt-2 rounded-lg px-4"
          onPress={() => continueHandler()}
        >
          <View className="flex-row items-center justify-between">
            <Text className="ml-2 text-white font-bold text-lg">Continue</Text>
            <Icon name="arrow-right" size={20} color={"white"} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
