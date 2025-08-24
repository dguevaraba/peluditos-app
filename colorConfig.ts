export interface ColorOption {
  id: string;
  color: string;
  name: string;
}

export const colorOptions: ColorOption[] = [
  { id: 'green', color: '#65b6ad', name: 'Green' },
  { id: 'teal', color: '#7FB3BA', name: 'Teal' },
  { id: 'purple', color: '#B8A9C9', name: 'Lavender' },
  { id: 'orange', color: '#F4C2A1', name: 'Peach' },
  { id: 'coral', color: '#FF6B6B', name: 'Coral' },
  { id: 'mint', color: '#98D8C8', name: 'Mint' },
  { id: 'rose', color: '#F7CAC9', name: 'Rose' },
  { id: 'sage', color: '#9CAF88', name: 'Sage' },
  { id: 'dusty_rose', color: '#D4A5A5', name: 'Dusty Rose' },
  { id: 'warm_orange', color: '#F4A261', name: 'Warm Orange' }
];

export const defaultColor = colorOptions[0].color; // '#65b6ad'
