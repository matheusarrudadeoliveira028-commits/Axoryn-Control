// components/ui/icon-symbol.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Adicionei os nomes 'gear', 'trash' e 'arrow.right.square'
type IconSymbolName = 
  | 'house.fill' 
  | 'paperplane.fill' 
  | 'chevron.left.forwardslash.chevron.right' 
  | 'chevron.right'
  | 'gear'
  | 'trash'
  | 'arrow.right.square';

const MAPPING: Record<IconSymbolName, ComponentProps<typeof MaterialIcons>['name']> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'gear': 'settings',          
  'trash': 'delete',           
  'arrow.right.square': 'logout',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}