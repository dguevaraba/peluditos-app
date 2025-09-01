import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface PenguinIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function PenguinIcon({ size = 24, style }: PenguinIconProps) {
  return (
    <Image
      source={require('../assets/icons/penguin-icon.png')}
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
