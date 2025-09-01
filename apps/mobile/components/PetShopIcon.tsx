import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface PetShopIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function PetShopIcon({ size = 24, style }: PetShopIconProps) {
  return (
    <Image
      source={require('../assets/icons/pet-shop.png')}
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
