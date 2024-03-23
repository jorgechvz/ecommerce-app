import React, { useEffect, useState } from "react";
import {
  Animated,
  Button,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SortByButton({ toggleMenu, setSort, menuVisible }) {
  const [menuAnimation] = useState(new Animated.Value(-70));
  useEffect(() => {
    Animated.timing(menuAnimation, {
      toValue: menuVisible ? 0 : -70,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [menuVisible]);
  return (
    <>
      {menuVisible && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <Animated.View
            className="flex-1 bg-gray-300 absolute z-[1] w-full h-full"
            style={{
              top: menuAnimation,
            }}
          >
            <View>
              <Text className="mt-10 mb-5 text-xl font-bold text-sky-900 text-center">
                Choose a option
              </Text>
              <Button
                title="Sort A-Z"
                onPress={() => {
                  setSort("az");
                  toggleMenu();
                }}
              />
              <Button
                title="Sort Z-A"
                onPress={() => {
                  setSort("za");
                  toggleMenu();
                }}
              />
              <Button
                title="Sort Price Low-High"
                onPress={() => {
                  setSort("price-asc");
                  toggleMenu();
                }}
              />
              <Button
                title="Sort Price High-Low"
                onPress={() => {
                  setSort("price-desc");
                  toggleMenu();
                }}
              />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
