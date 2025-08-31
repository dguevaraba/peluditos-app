import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dog, Zap } from 'lucide-react-native';

interface RobotDogIconProps {
  size?: number;
  color?: string;
  robotColor?: string;
}

const RobotDogIcon: React.FC<RobotDogIconProps> = ({ 
  size = 24, 
  color = '#45B7D1', 
  robotColor = '#FFD700' 
}) => {
  return (
    <View style={styles.container}>
      {/* Base dog icon */}
      <Dog size={size} color={color} />
      
      {/* Robot elements overlay */}
      <View style={[styles.robotEye, { backgroundColor: robotColor }]} />
      <View style={[styles.robotEye, { backgroundColor: robotColor, right: size * 0.15 }]} />
      
      {/* Robot antenna */}
      <View style={[styles.antenna, { backgroundColor: robotColor }]}>
        <Zap size={size * 0.3} color={robotColor} style={styles.antennaTip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  robotEye: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: '25%',
    left: '25%',
  },
  antenna: {
    position: 'absolute',
    width: 2,
    height: 8,
    top: -4,
    left: '50%',
    marginLeft: -1,
  },
  antennaTip: {
    position: 'absolute',
    top: -2,
    left: -2,
  },
});

export default RobotDogIcon;
