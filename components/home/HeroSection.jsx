import React, { useRef, useEffect, useState } from "react";
import { Dimensions, Image, View, FlatList } from "react-native";
// images for the carousel
const images = [
  require("../../assets/banner-1.png"),
  require("../../assets/banner-2.png"),
  require("../../assets/banner-3.png"),
];
// window width and item height for the carousel
const windowWidth = Dimensions.get("window").width;
const itemHeight = 150;
// Hero component with a carousel
const Hero = () => {
  // state variable to manage the index of the carousel
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);
  // render each image item in the flatlist
  const renderItem = ({ item }) => (
    <View>
      <Image source={item} style={{ width: windowWidth, height: itemHeight }} />
    </View>
  );
  // set an interval to scroll the carousel every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      // scroll to the next image in the carousel every 7 seconds using the scrollToIndex method
      setIndex((prevIndex) => {
        const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <FlatList
      ref={carouselRef}
      data={images}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => "carousel_item_" + index.toString()}
      getItemLayout={(data, index) => ({
        length: windowWidth,
        offset: windowWidth * index,
        index,
      })}
    />
  );
};

export default Hero;
