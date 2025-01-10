import { ColorKey, getColorInfo } from '../types';
import styles from './Amulet.module.css';

interface ColorPickerButtonProps {
  color: ColorKey;
  selectedColor: ColorKey;
  onColorSelect: (color: ColorKey) => void;
}

export const ColorPickerButton = ({ color, selectedColor, onColorSelect }: ColorPickerButtonProps) => {
  const colorInfo = getColorInfo(color);
  
  return (
    <button
      className={`${styles.colorButton} ${styles[color.toLowerCase()]} ${
        selectedColor === color ? styles.active : ''
      }`}
      onClick={() => onColorSelect(color)}
      style={{ backgroundColor: colorInfo.code }}
    />
  );
}; 