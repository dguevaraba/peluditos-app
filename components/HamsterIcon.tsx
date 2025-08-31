import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface HamsterIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function HamsterIcon({ size = 24, style }: HamsterIconProps) {
  return (
    <Image
      source={require('../assets/icons/hamster-icon.png')}
      style={[
        { 
          width: size, 
          height: size,
          backgroundColor: 'transparent',
        }, 
        style
      ]}
      resizeMode="contain"
    />
  );
}
