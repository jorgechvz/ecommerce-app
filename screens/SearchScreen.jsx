import React, { useState } from "react";
import { Divider, SearchBar } from "@rneui/themed";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import data from "../data/data.json";
import { useNavigation } from "@react-navigation/native";
import { capitalize } from "../utils/utils";

function SearchScreen() {
  const navigation = useNavigation();
  // get products from data.json
  const products = data.products;
  // state variable to manage the search text input
  const [searchText, setSearchText] = useState("");
  // filter the products based on the search text input and return the flatlist with the filtered products
  const filteredProducts = searchText
    ? products.filter((product) =>
        product.title.toLowerCase().startsWith(searchText.toLowerCase())
      )
    : [];
  // render each product item in the flatlist
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ProductDetail", {
            id: item.id,
            name: capitalize(item.title),
          });
        }}
        className="mx-4 p-4 mb-3 bg-gray-200 rounded-lg"
      >
        <View className="flex-row space-x-3 items-center">
          <Image
            source={{ uri: item.images[0] }}
            style={{ width: 50, height: 50 }}
          />
          <View className="w-60 space-y-2">
            <Text className="font-bold text-[18px]">{item.title}</Text>
            <Text className="font-bold text-lg">${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  // return the search screen with the search bar and the flatlist
  return (
    <View className="bg-white flex-1">
      <View className="mx-4 mt-8 mb-4 bg-white">
        <SearchBar
          platform="ios"
          searchIcon={{ size: 24, name: "search" }}
          clearIcon={{ size: 24, name: "close-circle" }}
          leftIconContainerStyle={{
            paddingHorizontal: 10,
          }}
          containerStyle={{
            padding: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
            borderRadius: 10,
          }}
          inputContainerStyle={{
            backgroundColor: "rgb(229, 231, 235)",
            borderWidth: 1,
            borderBottomWidth: 1,
            borderRadius: 10,
          }}
          inputStyle={{
            color: "black",
            fontSize: 20,
          }}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor="#777"
          value={searchText}
        />
      </View>
      <Divider color="black" width={1} style={{ marginHorizontal: 18 }} />
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

export default SearchScreen;
