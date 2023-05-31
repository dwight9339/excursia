import React, { ChangeEvent } from "react";
import styles from "../../styles/GridCheckbox.module.scss";
import Image from "next/image";

interface CheckboxItem {
  id: string;
  label: string;
  img: string;
  value: string;
}

interface GridCheckboxProps {
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  items: CheckboxItem[];
  interestList: string[];
  device: string;
  numColumns?: number;
}

const GridCheckbox: React.FC<GridCheckboxProps> = ({
  name,
  onChange,
  items,
  interestList,
  device,
  numColumns=3
}) => {
  let iconSize = 40;

  if (device === "tablet") {
    iconSize = 30;
  } else if (device === "phone") {
    iconSize = 20;
  }

  return (
    <div
      className={styles.grid}
    >
      {items.map((item, index) => {
        let cornerClass = "";

        if (index === 0) {
          cornerClass = styles.topLeft;
        } else if (index === numColumns - 1) {
          cornerClass = styles.topRight;
        } else if (index === items.length - numColumns) {
          cornerClass = styles.bottomLeft;
        } else if (index === items.length - 1) {
          cornerClass = styles.bottomRight;
        }

        return (
          <label 
            key={item.id}
            className={`
              ${styles.gridItem} 
              ${(index + 1) % 3 !== 0 ? styles.rightBorder : ""} 
              ${index + 1 <= items.length - numColumns ? styles.bottomBorder : ""}
              ${interestList.includes(item.value) ? styles.selected : ""}
              ${cornerClass}
            `}
          >
            <input
              type="checkbox"
              name={name}
              value={item.value}
              onChange={onChange}
            />
            <div className={styles.imageContainer}>
              <Image
                src={item.img}
                alt={item.label}
                width={iconSize}
                height={iconSize}
              />
            </div>
            <span className={styles.itemLabel}>{item.label}</span>
          </label>
        )
      })}
    </div>
  );
};

export default GridCheckbox;