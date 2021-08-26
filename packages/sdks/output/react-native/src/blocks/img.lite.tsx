import * as React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useContext } from "react";
import { Builder } from "@builder.io/sdk";

export default function ImgComponent(props) {
  return (
    <View
      {...props.attributes}
      style={{
        objectFit: props.backgroundSize || "cover",
        objectPosition: props.backgroundPosition || "center",
      }}
      key={(Builder.isEditing && props.imgSrc) || "default-key"}
      alt={props.altText}
      src={props.imgSrc}
    />
  );
}
