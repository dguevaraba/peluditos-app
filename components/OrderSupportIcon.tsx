import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface OrderSupportIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function OrderSupportIcon({ size = 24, style }: OrderSupportIconProps) {
  return (
    <Image
      source={require('../assets/icons/order-support.png')}
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
