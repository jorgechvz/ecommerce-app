import React, { useEffect, useState } from "react";
import {
  Animated,
  Button,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { capitalize } from "../utils/utils";

export default function FilterButton({
  toggleMenu,
  setSort,
  menuVisible,
  brands,
}) {
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
                Choose a brand to filter
              </Text>
              {brands.map((brand) => (
                <Button
                  title={capitalize(brand)}
                  onPress={() => {
                    setSort(brand);
                    toggleMenu();
                  }}
                  key={brand}
                />
              ))}
              <Button
                title="Clear Filter"
                onPress={() => {
                  setSort("");
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
