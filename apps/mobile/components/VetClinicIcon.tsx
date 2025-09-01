import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface VetClinicIconProps {
  size?: number;
  style?: ImageStyle;
  color?: string; // Para mantener compatibilidad con otros iconos
}

export default function VetClinicIcon({ size = 24, style, color }: VetClinicIconProps) {
  return (
    <Image
      source={require('../assets/icons/vet-clinic.png')}
      style={[
        { 
          width: size, 
          height: size,
          // Asegurar que la imagen se vea nítida
          backgroundColor: 'transparent',
        }, 
        style
      ]}
      resizeMode="contain"
    />
  );
}
