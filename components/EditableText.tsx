import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/EditableText.module.scss";

interface EditableTextProps {
  text: string;
  numeric?: boolean;
  onEdit: (text: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  text,
  numeric,
  onEdit
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(text);
  const [hover, setHover] = useState<boolean>(false);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    onEdit(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div
      className={styles.container}
      data-testid="editable-text-container"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}  
    >
      {editing ? 
        <input
          className={styles.input}
          autoFocus
          type={numeric ? "number" : "text"}
          value={value}
          data-testid="editable-text-input"
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
        :
        <>
          <p data-testid="editable-text-text">
            {value}
          </p>
          {hover && <div 
            className={styles.editButtonContainer}
            data-testid="edit-button"
            onClick={handleEdit}
          >
            <Image 
              src="/images/edit.png"
              alt="Edit"
              width={20}
              height={20}
            />
          </div>}
        </>
      }
    </div>
  );
};

export default EditableText;