import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface DogWalkingIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function DogWalkingIcon({ size = 24, style }: DogWalkingIconProps) {
  return (
    <Image
      source={require('../assets/icons/dog-walking.png')}
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
