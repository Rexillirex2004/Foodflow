import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet, View } from "react-native";
import { Logo } from "./Logo";
import { colors } from "./ui";

const LOGO_ANIM_DURATION = 700;
const SLOGAN_DELAY_AFTER_LOGO = 500;
const SLOGAN_ANIM_DURATION = 450;
const TOTAL_DURATION = 3000;
const FADE_OUT_DURATION = 450;

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const sloganTranslateY = useRef(new Animated.Value(14)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo: Scale & Fade (empieza 20% más chico y transparente, crece a su tamaño real).
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: LOGO_ANIM_DURATION,
        easing: Easing.out(Easing.back(1.15)),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: LOGO_ANIM_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Eslogan: Slide Up, 0.5s después de que el logo termina su animación.
    const sloganTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(sloganTranslateY, {
          toValue: 0,
          duration: SLOGAN_ANIM_DURATION,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sloganOpacity, {
          toValue: 1,
          duration: SLOGAN_ANIM_DURATION,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: SLOGAN_ANIM_DURATION,
        delay: 150,
        useNativeDriver: true,
      }).start();
    }, LOGO_ANIM_DURATION + SLOGAN_DELAY_AFTER_LOGO);

    // La pantalla dura exactamente 3s, luego hace fade out hacia la app.
    const finishTimer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: FADE_OUT_DURATION,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, TOTAL_DURATION);

    return () => {
      clearTimeout(sloganTimer);
      clearTimeout(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Logo size={104} />
      </Animated.View>

      <View style={styles.bottomArea}>
        <Animated.Text
          style={[styles.slogan, { opacity: sloganOpacity, transform: [{ translateY: sloganTranslateY }] }]}
        >
          El flujo inteligente de tu restaurante
        </Animated.Text>

        <Animated.View style={{ opacity: loaderOpacity, marginTop: 16 }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomArea: {
    position: "absolute",
    bottom: 72,
    alignItems: "center",
  },
  slogan: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
});
