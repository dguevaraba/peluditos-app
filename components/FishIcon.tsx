import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface FishIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function FishIcon({ size = 24, style }: FishIconProps) {
  return (
    <Image
      source={require('../assets/icons/fish-icon.png')}
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
