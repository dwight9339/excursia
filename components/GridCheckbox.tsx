import React, { ChangeEvent } from "react";
import styles from "./GridCheckbox.module.css";

interface CheckboxItem {
  id: string;
  label: string;
  icon: JSX.Element;
  value: string;
}

interface GridCheckboxProps {
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  items: CheckboxItem[];
  numColumns?: number;
}

const GridCheckbox: React.FC<GridCheckboxProps> = ({
  name,
  onChange,
  items,
  numColumns=3
}) => {
  return (
    <div
      className={styles.grid}
    >
      {items.map((item) => (
        <label 
          key={item.id}
          className={styles.gridItem}
        >
          <input
            type="checkbox"
            name={name}
            value={item.value}
            onChange={onChange}
          />
          <i>{item.icon}</i>
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
};

export default GridCheckbox;