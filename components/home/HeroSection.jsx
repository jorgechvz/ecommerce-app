/* import { Component } from "react";
import { Dimensions, Image, View } from "react-native"
import Carousel from "react-native-snap-carousel";

const images = [
  require("../../assets/banner-1.png"),
  require("../../assets/banner-2.png"),
  require("../../assets/banner-3.png"),
];

const sliderWidth = Dimensions.get("window").width;
const itemWidth = Dimensions.get("window").width;

class Hero extends Component {
  renderItem = ({ item, index }) => {
    return (
      <View>
        <Image source={item} style={{ width: "100%", height: 150 }} />
      </View>
    );
  };

  render() {
    return (
      <Carousel
        ref={(c) => {
          this._carousel = c;
        }}
        data={images}
        renderItem={this.renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        loop
        autoplay
      />
    );
  }
}

export default Hero; */

/* import { Dimensions, Image, View } from "react-native";

export default function HeroSection() {
  return (
    <View className="mt-5">
      <Image
        source={require("../../assets/banner-1.png")}
        style={{ width: "100%", height: 150 }}
      />
    </View>
  );
}  */

import React, { useRef, useEffect, useState } from "react";
import { Dimensions, Image, View, FlatList } from "react-native";

const images = [
  require("../../assets/banner-1.png"),
  require("../../assets/banner-2.png"),
  require("../../assets/banner-3.png"),
];

const windowWidth = Dimensions.get("window").width;
const itemHeight = 150;

const Hero = () => {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);

  const renderItem = ({ item }) => (
    <View>
      <Image source={item} style={{ width: windowWidth, height: itemHeight }} />
    </View>
  );

  useEffect(() => {
    const timer = setInterval(() => {
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
