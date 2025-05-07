import React, { ReactNode } from "react";
import { Pressable, PressableProps, ViewStyle } from "react-native";

interface BBPressableProps extends PressableProps {
  children?: ReactNode | string;
  style?: ViewStyle; // Style for the button itself
}
export default function BBPressable({
  style,
  children,
  ...props
}: BBPressableProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          ...{ opacity: pressed ? 0.5 : 1.0 },
          ...(style || {}),
        },
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}
