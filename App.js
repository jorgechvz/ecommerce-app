import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  titleStiles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
      fontWeight: "bold",
      marginBottom: 20,
    },
  });
  return (
    <View style={styles.container}>
      <Text
        style={titleStiles.container}
      >
        E-commerce App
      </Text>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
        }}
      >
        This is a e-commerce app with react native
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
