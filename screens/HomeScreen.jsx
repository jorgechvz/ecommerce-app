import React from "react";
import { View, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import data from "../data/data.json";
import CategoriesProducts from "../components/home/CategoriesProducts";
import Icon from "react-native-vector-icons/FontAwesome6";
import Hero from "../components/home/HeroSection";
import PopularProducts from "../components/home/PopularProducts";
import SearchIcon from "react-native-vector-icons/FontAwesome";
import TopSales from "../components/home/TopSales";
import DeliveryBanner from "../components/home/DeliveryBanner";

const products = data.products;

export default function HomeScreen() {
  const navigation = useNavigation();
  
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-2 flex-row justify-between items-center mt-3 mb-4 mx-1">
        <Image
          source={require("../assets/logo-app.png")}
          style={{ width: 180, height: 60 }}
        />
        {/* Cart Icon */}
        <View className="flex-row items center justify-center gap-x-4">
          <TouchableOpacity
            className="self-center"
            onPress={() => navigation.navigate("Search")}
          >
            <SearchIcon name="search" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => {
              navigation.navigate("Cart");
            }}
          >
            <Icon name="cart-shopping" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Components  */}
      <Hero />
      <CategoriesProducts navigation={navigation} />
      <PopularProducts products={products} navigation={navigation} />
      <DeliveryBanner />
      <TopSales products={products} navigation={navigation} />
    </ScrollView>
  );
}
