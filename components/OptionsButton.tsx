import React, { useState } from "react";
import styles from "../styles/OptionsButton.module.scss";
import Image from "next/image";

interface OptionsButtonProps {
  options: {
    name: string;
    onClick: () => void;
  }[];
}

const OptionsButton: React.FC<OptionsButtonProps> = ({
  options
}) => {
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div 
        className={styles.optionsButton}
        data-testid="options-button--options-button"
        onClick={() => setOptionsOpen(!optionsOpen)}
      >
        <Image
          src="/images/more-options.png"
          alt="more options"
          data-testid="options-button--options-button-icon"
          width={20}
          height={20}
        />
      </div>
      {optionsOpen && <div className={styles.optionsContainer}>
        <div className={styles.optionsList}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.option}
              data-testid={`options-button--option`}
              onClick={() => {
                option.onClick();
                setOptionsOpen(false);
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default OptionsButton;