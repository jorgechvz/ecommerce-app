import { Button, Text, View } from "react-native";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
