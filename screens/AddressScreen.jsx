import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Input } from "@rneui/themed";

export default function AddressScreen() {
  const navigation = useNavigation();
  const [checked, setChecked] = useState({});
  const [addressOption, setAddressOption] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const removeAddress = async (indexToRemove) => {
    const updatedAddresses = addresses.filter(
      (address, index) => index !== indexToRemove
    );
    setAddresses(updatedAddresses);
    await AsyncStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    if (addressOption === indexToRemove) {
      setAddressOption(null);
      setChecked({});
    }
  };

  const clearShipping = async () => {
    await AsyncStorage.removeItem("addresses");
  };
  const continueButtonHandler = async () => {
    if (addressOption !== null) {
      const selectedAddress = addresses[addressOption];
      await AsyncStorage.removeItem("OrderAddress");
      await AsyncStorage.setItem(
        "OrderAddress",
        JSON.stringify(selectedAddress)
      );
      navigation.navigate("Payment");
    } else {
      alert("Please select an address before continuing.");
    }
  };
  useEffect(() => {
    const fetchAddressesAndOrderAddress = async () => {
      const [storedAddresses, storedOrderAddress] = await Promise.all([
        AsyncStorage.getItem("addresses"),
        AsyncStorage.getItem("OrderAddress"),
      ]);
      let addresses = [];
      if (storedAddresses !== null) {
        addresses = JSON.parse(storedAddresses);
        setAddresses(addresses);
      }
      if (storedOrderAddress !== null) {
        const orderAddress = JSON.parse(storedOrderAddress);
        const index = addresses.findIndex(
          (address) => JSON.stringify(address) === JSON.stringify(orderAddress)
        );
        if (index !== -1) {
          setChecked({ [index]: true });
          setAddressOption(index);
        }
      }
    };

    fetchAddressesAndOrderAddress();
  }, []);
  const addAddress = async () => {
    if (newAddress.name && newAddress.address && newAddress.phone) {
      const updatedAddresses = [...addresses, newAddress];
      setAddresses(updatedAddresses);
      await AsyncStorage.setItem("addresses", JSON.stringify(updatedAddresses));
      setNewAddress({ name: "", address: "", phone: "" });
      setModalVisible(false);
    } else {
      alert("Please fill all the fields");
    }
  };

  const selectAddress = (index) => {
    if (addressOption === index) {
      setAddressOption(null);
      setChecked({});
    } else {
      setAddressOption(index);
      setChecked({ [index]: true });
    }
  };

  function renderItem({ item, index }) {
    return (
      <>
        <View
          className="flex-row items-center justify-between p-3 border-1 my-2 mx-4 rounded-lg bg-gray-200"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View className="space-y-1">
            <Text className="font-bold">{item.name}</Text>
            <Text className="text-gray-700">
              <Icon name="house" size={12} /> {item.address}
            </Text>
            <Text className="text-gray-700">
              <Icon name="phone" size={12} /> {item.phone}
            </Text>
          </View>
          <View className="flex-row items-center">
            <CheckBox
              checked={checked[index] || false}
              onPress={() => selectAddress(index)}
              textStyle={{ fontWeight: "bold" }}
              checkedIcon="check-circle"
              uncheckedIcon="circle"
              checkedColor="green"
              size={25}
              containerStyle={{
                backgroundColor: "transparent",
                width: 30,
              }}
            />
            <TouchableOpacity onPress={() => removeAddress(index)}>
              <Icon name="circle-xmark" size={20} style={{ color: "red" }} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center mx-4">
          <Text className="text-xl font-bold mb-10">
            Address and Contact Info
          </Text>
          <Input
            value={newAddress.name}
            onChangeText={(text) =>
              setNewAddress((prevState) => ({ ...prevState, name: text }))
            }
            placeholder="Name"
            leftIcon={
              <Icon
                name="user-large"
                size={20}
                style={{ paddingHorizontal: 10 }}
              />
            }
            inputContainerStyle={{
              borderBottomWidth: 0,
              borderRadius: 10,
              backgroundColor: "#f0f0f0",
              padding: 10,
            }}
          />
          <Input
            value={newAddress.address}
            onChangeText={(text) =>
              setNewAddress((prevState) => ({
                ...prevState,
                address: text,
              }))
            }
            placeholder="Address"
            leftIcon={
              <Icon
                name="location-dot"
                size={20}
                style={{ paddingHorizontal: 10 }}
              />
            }
            inputContainerStyle={{
              borderBottomWidth: 0,
              borderRadius: 10,
              backgroundColor: "#f0f0f0",
              padding: 10,
            }}
          />
          <Input
            value={newAddress.phone}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              if (numericText.length <= 9) {
                setNewAddress((prevState) => ({
                  ...prevState,
                  phone: numericText,
                }));
              }
            }}
            leftIcon={
              <Icon name="phone" size={20} style={{ paddingHorizontal: 10 }} />
            }
            placeholder="Phone"
            inputContainerStyle={{
              borderBottomWidth: 0,
              borderRadius: 10,
              backgroundColor: "#f0f0f0",
              padding: 10,
            }}
          />
          <View className="flex-row gap-x-2 mx-1">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-500 p-2 rounded-lg flex-1"
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addAddress}
              className="bg-blue-500 p-2 rounded-lg flex-1"
            >
              <Text className="text-white text-center font-bold">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text className="font-bold m-4 text-lg">Select Delivery Address</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={addresses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => renderItem(item, item.index)}
        />
        <View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-gray-200 p-2 rounded-lg mx-4 my-4"
          >
            <Text className="text-center font-bold text-xl">
              <Icon name="circle-plus" size={20} /> Add Address
            </Text>
          </TouchableOpacity>
          <View className="border-t-2 px-4 py-3 border-slate-300">
            <Text>Next Step: Payment</Text>
            <TouchableOpacity
              className="bg-black py-2 mt-2 rounded-lg px-4"
              onPress={() => continueButtonHandler()}
            >
              <View className="flex-row items-center justify-between">
                <Text className="ml-2 text-white font-bold text-lg">
                  Continue
                </Text>
                <Icon name="arrow-right" size={20} color={"white"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
