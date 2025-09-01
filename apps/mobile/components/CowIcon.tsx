import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface CowIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function CowIcon({ size = 24, style }: CowIconProps) {
  return (
    <Image
      source={require('../assets/icons/cow-icon.png')}
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
