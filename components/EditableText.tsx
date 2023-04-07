import React from "react";
import {
  Typography,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import styles from "./EditableText.module.css";

interface EditableTextProps {
  text: string;
  onEdit: (text: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ text, onEdit }) => {
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
          type="text"
          value={value}
          onChange={(e) => onEdit(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditing(false);
            }
          }
          }
        />
        :
        <>
          <Typography variant="h4" component="h1" className={styles.text}>
            {value}
          </Typography>
          <IconButton 
            className={styles.editButton}
            onClick={() => setEditing(true)}
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