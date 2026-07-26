import React from "react";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import { colors } from "./ui";

// Logotipo de marca: plato visto desde arriba, tenedor a la izquierda,
// cuchillo a la derecha y una "F" integrada al centro.
export function Logo({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={31} fill={colors.wood} />
      <Circle cx={32} cy={32} r={24} fill="none" stroke={colors.primary} strokeWidth={1.4} opacity={0.55} />

      {/* Tenedor (izquierda) */}
      <Path
        d="M20 14 V26 M23 14 V26 M26 14 V26 M20 26 C20 30 26 30 26 26"
        stroke={colors.primary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M23 30 V50" stroke={colors.primary} strokeWidth={1.8} strokeLinecap="round" />

      {/* Cuchillo (derecha) */}
      <Path
        d="M41 14 C46 16 46 24 41 28 V50"
        stroke={colors.primary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Letra F integrada al centro */}
      <SvgText x={32} y={40} fontSize={22} fontWeight="700" fill={colors.bg} textAnchor="middle">
        F
      </SvgText>
    </Svg>
  );
}
