import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  Modal,
  Text,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const { width } = Dimensions.get("window");

export default function RenderCarousel({ data }) {
  // Use state to keep track of the active index of the carousel 
  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  // Use ref to keep track of the FlatList component and the animations
  const flatListRef = useRef();
  const animations = useRef(data.map(() => new Animated.Value(10))).current;

  // Use ref to keep track of the viewabilityConfig for the FlatList
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  // Use ref to keep track of the onViewRef function for the FlatList 
  const onViewRef = useRef(({ viewableItems }) => {
    setActiveIndex(viewableItems[0].index);
  });
  // Use ref to keep track of the scrollToIndex function for the FlatList
  const scrollToIndex = (index) => {
    flatListRef.current.scrollToIndex({ index });
  };

  // Create an array of image objects for the ImageViewer component 
  const imagesForViewer = data.map((image) => ({ url: image }));
  // Create a function to render each item in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setIsViewerOpen(true)}>
      <View className="w-[414px] h-[350px]">
        <Image source={{ uri: item }} className="rounded-md w-full h-full" />
      </View>
    </TouchableOpacity>
  );
  // Use useEffect to animate the active index indicator when the active index changes
  useEffect(() => {
    Animated.parallel(
      animations.map((anim, i) =>
        Animated.timing(anim, {
          toValue: i === activeIndex ? 30 : 10,
          duration: 300,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [activeIndex]);
  // Return the FlatList component with the renderItem function, the active index indicators, and the ImageViewer component
  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig.current}
      />
      <View className="flex-row justify-center mt-2">
        {data.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => scrollToIndex(i)}>
            <Animated.View
              style={{
                width: animations[i],
                height: 10,
                borderRadius: 5,
                marginHorizontal: 3,
                backgroundColor: i === activeIndex ? "blue" : "gray",
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        visible={isViewerOpen}
        transparent={true}
        onRequestClose={() => setIsViewerOpen(false)}
      >
        <ImageViewer
          imageUrls={imagesForViewer}
          onClick={() => setIsViewerOpen(false)}
          index={activeIndex}
          style={{
            backgroundColor: "black",
            paddingTop: 10,
          }}
          enableImageZoom
        />
      </Modal>
    </View>
  );
}
