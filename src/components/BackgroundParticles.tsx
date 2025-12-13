import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native";

const { width, height } = Dimensions.get("window");
const NUM_PARTICLES = 40; // Daha fazla yıldız/parçacık

interface ParticleProps {
  color: string;
}

const Particle = ({ color }: ParticleProps) => {
  // Rastgele başlangıç pozisyonları
  const positionX = useRef(new Animated.Value(Math.random() * width)).current;
  const positionY = useRef(new Animated.Value(Math.random() * height)).current;
  const opacity = useRef(new Animated.Value(Math.random() * 0.5 + 0.1)).current;
  const scale = useRef(new Animated.Value(Math.random() * 0.8 + 0.2)).current;

  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Use Animated.loop for continuous movement to prevent freezing
    // We create a sequence of random movements that loops
    const createAnimation = (): void => {
      const durationX = 20000 + Math.random() * 15000;
      const durationY = 20000 + Math.random() * 15000;

      Animated.loop(
        Animated.sequence([
          Animated.timing(positionX, {
            toValue: Math.random() * width,
            duration: durationX,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(positionX, {
            toValue: Math.random() * width,
            duration: durationX,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(positionY, {
            toValue: Math.random() * height,
            duration: durationY,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(positionY, {
            toValue: Math.random() * height,
            duration: durationY,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    createAnimation();
  }, [opacity, positionX, positionY, scale]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: 6, // Biraz daha küçük, yıldız gibi
        height: 6,
        borderRadius: 3,
        backgroundColor: color,
        transform: [
          { translateX: positionX },
          { translateY: positionY },
          { scale },
        ],
        opacity,
      }}
    />
  );
};

interface BackgroundParticlesProps {
  color: string;
  enabled: boolean;
}

const BackgroundParticles = ({ color, enabled }: BackgroundParticlesProps) => {
  if (!enabled) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
        <Particle key={i} color={color} />
      ))}
    </View>
  );
};

export default BackgroundParticles;
