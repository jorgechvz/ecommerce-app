import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import data from "../data/data.json";
import SortByButton from "../components/SortByButton";
import SortIcon from "react-native-vector-icons/FontAwesome";
import FilterIcon from "react-native-vector-icons/Ionicons";
import FilterButton from "../components/FiltersButtons";
import { useNavigation } from "@react-navigation/native";
import { Rating } from "react-native-ratings";
import { calculateDiscount, capitalize } from "../utils/utils";

export default function SubCategoryScreen({ route }) {
  const navigation = useNavigation();
  const { name } = route.params;
  // Get the products based on the category name
  const getProductsBrands = data.products.filter((product) => {
    if (product.category === name) {
      return true;
    }
    if (name === "top-sales" && product.stock < 30) {
      return true;
    }
    if (name === "popular" && product.rating >= 4.9) {
      return true;
    }
    return false;
  });
  // State variables to manage the sort, brand, sort menu visibility, and filter menu visibility
  const [sort, setSort] = useState(null);
  const [brand, setBrand] = useState(null);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  // Function to toggle the filter menu visibility
  const toggleFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };
  // Function to toggle the sort menu visibility
  const toggleSortMenu = () => {
    setSortMenuVisible(!sortMenuVisible);
  };
  // Filter the products based on the category name, brand, and sort
  let products = data.products.filter((product) => {
    if (product.category === name) {
      return true;
    }
    if (name === "top-sales" && product.stock < 30) {
      return true;
    }
    if (name === "popular" && product.rating >= 4.9) {
      return true;
    }
    return false;
  });
  // Filter the products based on the brand name
  if (brand) {
    products = products.filter((product) => product.brand === brand);
  }
  // Sort the products based on the sort value
  if (sort) {
    products.sort((a, b) => {
      if (sort === "price-asc") {
        return a.price - b.price;
      }
      if (sort === "price-desc") {
        return b.price - a.price;
      }
      if (sort === "az") {
        return a.title.localeCompare(b.title);
      }
      if (sort === "za") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }
  // Get the unique brands from the products
  const brands = [
    ...new Set(getProductsBrands.map((product) => product.brand)),
  ];
  // Function to render the product item
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        className="border-2 border-gray-200 bg-gray-200 rounded-lg my-2 w-full items-center"
        onPress={() => {
          navigation.navigate("ProductDetail", {
            id: item.id,
            name: capitalize(item.title),
          });
        }}
      >
        <View className="flex-row">
          <View className="flex-1">
            <Image
              source={{ uri: item.images[0] }}
              className="w-full h-[200px] rounded-t-lg"
            />
            <View className="px-2 py-3">
              <Text className="font-bold text-lg">{item.title}</Text>
              <Rating
                imageSize={20}
                readonly
                tintColor="rgb(229, 231, 235)"
                startingValue={item.rating}
                style={{ paddingVertical: 10, alignItems: "flex-start" }}
              />
              <Text>{item.brand}</Text>
              <View className="flex-row items-center">
                <Text className="font-bold text-lg">
                  $
                  {calculateDiscount(
                    item.price,
                    item.discountPercentage
                  ).toFixed(2)}
                </Text>
                <Text className="ml-2 line-through text-red-500">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="mx-3 my-5">
        <View className="flex-row gap-2 items-center">
          <TouchableOpacity
            onPress={toggleSortMenu}
            className="flex-1 rounded-md px-3 py-2 bg-gray-300 flex-row items-center justify-between"
          >
            <Text className="text-lg font-bold">Sort By</Text>
            <SortIcon name="sort" size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleFilterMenu}
            className="flex-1 rounded-md px-3 py-2 bg-gray-300 flex-row items-center justify-between"
          >
            <Text className="text-lg font-bold">Filter By</Text>
            <FilterIcon name="filter-circle" size={28} />
          </TouchableOpacity>
        </View>
      </View>
      <SortByButton
        toggleMenu={toggleSortMenu}
        setSort={setSort}
        menuVisible={sortMenuVisible}
      />
      <FilterButton
        brands={brands}
        toggleMenu={toggleFilterMenu}
        setSort={setBrand}
        menuVisible={filterMenuVisible}
      />
      <FlatList
        className="mx-3 mb-5"
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
