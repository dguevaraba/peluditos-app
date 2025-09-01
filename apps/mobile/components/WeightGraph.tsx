import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import { PetWeightRecord } from '../services/petService';

interface WeightGraphProps {
  weightData: PetWeightRecord[];
  selectedColor: string;
  textColor: string;
  textSecondaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  borderColor: string;
  showLastMonths?: number; // Optional: show only last X months
}

interface TooltipData {
  weight: number;
  date: string;
  notes?: string;
  unit: string;
  x: number;
  y: number;
}

const { width: screenWidth } = Dimensions.get('window');
const GRAPH_WIDTH = screenWidth - 80; // Account for padding
const GRAPH_HEIGHT = 120;
const PADDING = 20;

const WeightGraph: React.FC<WeightGraphProps> = ({ 
  weightData, 
  selectedColor, 
  textColor, 
  textSecondaryColor, 
  backgroundColor,
  cardBackgroundColor,
  borderColor,
  showLastMonths 
}) => {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  console.log('WeightGraph - weightData:', weightData);

  if (!weightData || weightData.length === 0) {
    console.log('WeightGraph - No data available');
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.noDataText, { color: textSecondaryColor }]}>
          No weight data available
        </Text>
        <Text style={[styles.noDataText, { color: textSecondaryColor, fontSize: 12, marginTop: 8 }]}>
          Add weight records to see the graph
        </Text>
      </View>
    );
  }

  // Sort data by date
  let sortedData = [...weightData].sort((a, b) => 
    new Date(a.recorded_date).getTime() - new Date(b.recorded_date).getTime()
  );

  // Filter by last X months if specified
  if (showLastMonths && showLastMonths > 0) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - showLastMonths);
    
    sortedData = sortedData.filter(record => 
      new Date(record.recorded_date) >= cutoffDate
    );
  }

  console.log('WeightGraph - sortedData:', sortedData);

  // Get min and max weights for scaling
  const weights = sortedData.map(record => record.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight;

  console.log('WeightGraph - weights:', weights, 'min:', minWeight, 'max:', maxWeight, 'range:', weightRange);

  // Calculate points for the graph
  const points = sortedData.map((record, index) => {
    const x = sortedData.length === 1 
      ? GRAPH_WIDTH / 2 
      : PADDING + (index / (sortedData.length - 1)) * (GRAPH_WIDTH - 2 * PADDING);
    const normalizedWeight = weightRange > 0 ? (record.weight - minWeight) / weightRange : 0.5;
    const y = GRAPH_HEIGHT - PADDING - normalizedWeight * (GRAPH_HEIGHT - 2 * PADDING);
    return { 
      x, 
      y, 
      weight: record.weight, 
      date: record.recorded_date,
      notes: record.notes,
      unit: record.weight_unit
    };
  });

  console.log('WeightGraph - calculated points:', points);

  // Generate month labels
  const monthLabels = sortedData.map((record, index) => {
    const date = new Date(record.recorded_date);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const x = sortedData.length === 1 
      ? GRAPH_WIDTH / 2 
      : PADDING + (index / (sortedData.length - 1)) * (GRAPH_WIDTH - 2 * PADDING);
    return { x, month };
  });

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = PADDING + ratio * (GRAPH_HEIGHT - 2 * PADDING);
          return (
            <Line
              key={`grid-${index}`}
              x1={PADDING}
              y1={y}
              x2={GRAPH_WIDTH - PADDING}
              y2={y}
              stroke={textSecondaryColor}
              strokeWidth={0.5}
              opacity={0.2}
            />
          );
        })}

        {/* Weight line */}
        {points.length > 1 && points.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = points[index - 1];
          return (
            <Line
              key={`line-${index}`}
              x1={prevPoint.x}
              y1={prevPoint.y}
              x2={point.x}
              y2={point.y}
              stroke={selectedColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.8}
            />
          );
        })}

        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={5}
            fill={selectedColor}
            stroke={textColor}
            strokeWidth={1.5}
            onPress={() => {
              setTooltipData({
                weight: point.weight,
                date: point.date,
                notes: point.notes,
                unit: point.unit,
                x: point.x,
                y: point.y
              });
              setShowTooltip(true);
            }}
          />
        ))}

        {/* Month labels */}
        {monthLabels.map((label, index) => (
          <SvgText
            key={`label-${index}`}
            x={label.x}
            y={GRAPH_HEIGHT - 5}
            fontSize={12}
            fill={textSecondaryColor}
            textAnchor="middle"
          >
            {label.month}
          </SvgText>
        ))}

        {/* Weight labels on the left */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = PADDING + ratio * (GRAPH_HEIGHT - 2 * PADDING);
          const weight = minWeight + (1 - ratio) * weightRange;
          return (
            <SvgText
              key={`weight-${index}`}
              x={PADDING - 5}
              y={y + 4}
              fontSize={10}
              fill={textSecondaryColor}
              textAnchor="end"
            >
              {weight.toFixed(1)}
            </SvgText>
          );
        })}
      </Svg>

      {/* Tooltip Modal */}
      <Modal
        visible={showTooltip}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTooltip(false)}
        >
          <View style={[styles.tooltip, { backgroundColor: cardBackgroundColor }]}>
            {tooltipData && (
              <>
                <View style={[styles.tooltipHeader, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.tooltipTitle, { color: selectedColor }]}>
                    Weight Record
                  </Text>
                </View>
                <View style={styles.tooltipContent}>
                  <Text style={[styles.tooltipText, { color: textColor }]}>
                    <Text style={{ fontWeight: 'bold', color: selectedColor }}>Date:</Text> {new Date(tooltipData.date).toLocaleDateString()}
                  </Text>
                  <Text style={[styles.tooltipText, { color: textColor }]}>
                    <Text style={{ fontWeight: 'bold', color: selectedColor }}>Weight:</Text> {tooltipData.weight} {tooltipData.unit}
                  </Text>
                  {tooltipData.notes && (
                    <Text style={[styles.tooltipText, { color: textColor }]}>
                      <Text style={{ fontWeight: 'bold', color: selectedColor }}>Notes:</Text> {tooltipData.notes}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: GRAPH_HEIGHT,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    borderRadius: 12,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
  },
  tooltipHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tooltipContent: {
    padding: 16,
    paddingTop: 12,
  },
  tooltipText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default WeightGraph;
