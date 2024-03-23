import { Image, View } from "react-native";

export default function DeliveryBanner() {
  return (
    <View className="mt-5">
      <Image
        source={require("../../assets/delivery-banner.png")}
        style={{ width: "100%", height: 150 }} 
      />
    </View>
  );
}
