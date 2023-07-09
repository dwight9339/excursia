import React from "react";
import Image from "next/image";
import { Edit as EditIcon } from '@mui/icons-material';
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
  const [editing, setEditing] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>(text);

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
    <div className={styles.container}>
      {editing ? 
        <input
          className={styles.input}
          autoFocus
          type={numeric ? "number" : "text"}
          value={value}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
        :
        <>
          <p>
            {value}
          </p>
          <div 
            className={styles.editButtonContainer} 
            onClick={handleEdit}
          >
            <Image 
              src="/images/edit.png"
              alt="Edit"
              width={20}
              height={20}
            />
          </div>
        </>
      }
    </div>
  );
};

export default EditableText;