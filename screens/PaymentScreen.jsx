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
import CardIcons from "react-native-vector-icons/Fontisto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Input, ButtonGroup } from "@rneui/themed";

export const cardsTypes = [
  {
    name: "visa",
    icon: <CardIcons name="visa" size={24} color="#000" />,
    color: "#1a1f71",
    title: "Visa",
  },
  {
    name: "mastercard",
    icon: <CardIcons name="mastercard" size={24} color="#000" />,
    color: "#eb001b",
    title: "Mastercard",
  },
  {
    name: "american-express",
    icon: <CardIcons name="american-express" size={24} color="#000" />,
    color: "#0070c0",
    title: "American Express",
  },
  {
    name: "dinners-club",
    icon: <CardIcons name="dinners-club" size={24} color="#000" />,
    color: "#008c95",
    title: "Dinners Club",
  },
];

export default function PaymentScreen() {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [checked, setChecked] = useState({});

  const [cardOption, setCardOption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [newCard, setNewCard] = useState({
    cardType: "",
    cardNumber: "",
    cardName: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
  });
  const [selectedIndex, setSelectedIndex] = useState();

  const removeCard = async (indexToRemove) => {
    const updatedCards = cards.filter((card, index) => index !== indexToRemove);
    setCards(updatedCards);
    await AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
    if (cardOption === indexToRemove) {
      setCardOption(null);
      setChecked({});
    }
  };

  const continueButtonHandler = async () => {
    if (cardOption !== null) {
      const selectedCards = cards[cardOption];
      await AsyncStorage.setItem(
        "paymentDetails",
        JSON.stringify(selectedCards)
      );
      navigation.navigate("OrderDetails");
    } else {
      alert("Please select a credit card before continuing.");
    }
  };
  useEffect(() => {
    const fetchCardsAndPaymentDetails = async () => {
      const [storedCards, storedPaymentDetails] = await Promise.all([
        AsyncStorage.getItem("cards"),
        AsyncStorage.getItem("paymentDetails"),
      ]);
      if (storedCards !== null) {
        const cards = JSON.parse(storedCards);
        setCards(cards);
        if (storedPaymentDetails !== null) {
          const paymentDetails = JSON.parse(storedPaymentDetails);
          const index = cards.findIndex(
            (card) => JSON.stringify(card) === JSON.stringify(paymentDetails)
          );
          if (index !== -1) {
            setChecked({ [index]: true });
            setCardOption(index);
          }
        }
      }
    };

    fetchCardsAndPaymentDetails();
  }, []);

  const addCard = async () => {
    if (
      newCard.cardType &&
      newCard.cardNumber &&
      newCard.cardName &&
      newCard.cvv &&
      newCard.expiryMonth &&
      newCard.expiryYear
    ) {
      const updateCard = [...cards, newCard];
      setCards(updateCard);
      await AsyncStorage.setItem("cards", JSON.stringify(updateCard));
      setNewCard({
        cardType: "",
        cardNumber: "",
        cardName: "",
        cvv: "",
        expiryMonth: "",
        expiryYear: "",
      });
      setModalVisible(false);
    } else {
      alert("Please fill all the fields");
    }
  };

  const selectCard = (index) => {
    if (cardOption === index) {
      setCardOption(null);
      setChecked({});
    } else {
      setCardOption(index);
      setChecked({ [index]: true });
    }
  };

  function renderItem({ item, index }) {
    const cardTypeObject = cardsTypes.find(
      (cardType) => cardType.name === item.cardType
    );
    const color = cardTypeObject ? cardTypeObject.color : "#000";
    const cardTitle = cardTypeObject ? cardTypeObject.title : item.cardType;
    const cardNumber = item.cardNumber.slice(-4);
    const maskedCardNumber = "**** " + cardNumber;
    const month = item.expiryMonth;
    const year = item.expiryYear.slice(-2);
    const expiryDate = month + "/" + year;

    return (
      <>
        <View className="flex-row items-center justify-between p-3 border-1 my-2 mx-4 rounded-lg bg-gray-200">
          <View className="mr-4">
            <CardIcons name={item.cardType} size={40} color={color} />
          </View>
          <View className="flex-1 flex-row justify-between items-center">
            <View className="space-y-1">
              <View className="flex-row items-center space-x-2">
                <Text className="font-bold">{cardTitle}</Text>
                <Text className="font-bold">{maskedCardNumber}</Text>
              </View>
              <View className="flex-row items-center space-x-1">
                <Text className="text-gray-700 text-[15px]">
                  {item.cardName}
                </Text>
                <Text className="text-gray-700 text-[15px]">{expiryDate}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <CheckBox
                checked={checked[index] || false}
                onPress={() => selectCard(index)}
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
              <TouchableOpacity onPress={() => removeCard(index)}>
                <Icon name="circle-xmark" size={20} style={{ color: "red" }} />
              </TouchableOpacity>
            </View>
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
        <View className="flex-1 justify-center mx-4">
          <Text className="text-xl font-bold mb-10 mx-3">Card Details</Text>
          <View>
            <Text className="text-[15px] font-bold mb-1 mx-4">
              Select Card Type
            </Text>
            <ButtonGroup
              buttons={cardsTypes.map((option, index) => {
                const color = index === selectedIndex ? "#fff" : "#000";
                return <CardIcons name={option.name} size={24} color={color} />;
              })}
              containerStyle={{
                borderRadius: 10,
                backgroundColor: "#f0f0f0",
                height: 50,
                marginBottom: 10,
              }}
              selectedButtonStyle={{ backgroundColor: "rgb(31, 41, 55)" }}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value);
                setNewCard((prevState) => ({
                  ...prevState,
                  cardType: cardsTypes[value].name,
                }));
              }}
            />
          </View>
          <Input
            label="Credit Card Number"
            labelStyle={{ color: "black", paddingBottom: 10, paddingLeft: 7 }}
            value={newCard.cardNumber}
            onChangeText={(text) => {
              let formattedText = text
                .replace(/[^0-9]/g, "")
                .replace(/(.{4})/g, "$1 ")
                .trim();
              setNewCard((prevState) => ({
                ...prevState,
                cardNumber: formattedText,
              }));
            }}
            leftIcon={
              <Icon
                name="credit-card"
                size={20}
                style={{ paddingHorizontal: 10 }}
              />
            }
            maxLength={19}
            placeholder="Credit Card Number"
            inputContainerStyle={{
              borderBottomWidth: 0,
              borderRadius: 10,
              backgroundColor: "#f0f0f0",
              padding: 10,
            }}
          />
          <Input
            label="Card Holder Name"
            labelStyle={{ color: "black", paddingBottom: 10, paddingLeft: 7 }}
            value={newCard.cardName}
            onChangeText={(text) =>
              setNewCard((prevState) => ({ ...prevState, cardName: text }))
            }
            placeholder="Card Name"
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
          <View className="flex-row ml-3">
            <View className="w-[50%]">
              <Text className="text-[16px] font-bold mb-[12px] mx-2">
                Expiry Date
              </Text>
              <View className="bg-[#f0f0f0] flex-row items-center h-[58px] px-5 rounded-lg border-0">
                <Input
                  containerStyle={{ flex: 1, marginRight: 5 }}
                  value={newCard.expiryMonth}
                  onChangeText={(text) => {
                    const newText = text.replace(/[^0-9]/g, "");
                    setNewCard((prevState) => ({
                      ...prevState,
                      expiryMonth: newText,
                    }));
                  }}
                  placeholder="MM"
                  maxLength={2}
                  inputStyle={{ textAlign: "center" }}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    paddingTop: 24,
                  }}
                />
                <Text className="font-bold text-xl">/</Text>
                <Input
                  containerStyle={{ flex: 1, marginLeft: 5 }}
                  value={newCard.expiryYear}
                  onChangeText={(text) => {
                    const newText = text.replace(/[^0-9]/g, "");
                    setNewCard((prevState) => ({
                      ...prevState,
                      expiryYear: newText,
                    }));
                  }}
                  inputStyle={{ textAlign: "center" }}
                  placeholder="YYYY"
                  maxLength={4}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    paddingTop: 24,
                  }}
                />
              </View>
            </View>
            <Input
              label="CVV"
              labelStyle={{ color: "black", paddingBottom: 10, paddingLeft: 7 }}
              containerStyle={{ width: "50%" }}
              value={newCard.cvv}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setNewCard((prevState) => ({
                  ...prevState,
                  cvv: numericText,
                }));
              }}
              maxLength={3}
              placeholder="cvv"
              inputStyle={{ paddingLeft: 10 }}
              inputContainerStyle={{
                borderBottomWidth: 0,
                borderRadius: 10,
                backgroundColor: "#f0f0f0",
                padding: 10,
              }}
            />
          </View>
          <View className="flex-row gap-x-2 mx-1">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-500 p-2 rounded-lg flex-1"
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addCard}
              className="bg-blue-500 p-2 rounded-lg flex-1"
            >
              <Text className="text-white text-center font-bold">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text className="font-bold m-4 text-lg">
        Select Credit Card to continue
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={cards}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => renderItem(item, item.index)}
        />
        <View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-gray-200 p-2 rounded-lg mx-4 my-4"
          >
            <Text className="text-center font-bold text-xl">
              <Icon name="circle-plus" size={20} /> Add new credit card
            </Text>
          </TouchableOpacity>
          <View className="border-t-2 px-4 py-3 border-slate-300">
            <Text>Next Step: Order Details</Text>
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
