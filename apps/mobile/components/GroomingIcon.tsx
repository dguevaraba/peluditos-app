import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface GroomingIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function GroomingIcon({ size = 24, style }: GroomingIconProps) {
  return (
    <Image
      source={require('../assets/icons/grooming.png')}
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
