import React from "react";
import {
  Typography,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import styles from "./EditableText.module.css";

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
          <Typography variant="h4" component="h1" className={styles.text}>
            {value}
          </Typography>
          <IconButton 
            className={styles.editButton}
            onClick={handleEdit}
            size="small"
          >
            <EditIcon />
          </IconButton>
        </>
      }
    </div>
  );
};

export default EditableText;