import React, { useState } from 'react';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import styles from "./TimeSelector.module.css";

interface TimeSelectorProps {
  onDateTimeChange: (dateTime: Date | null) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ onDateTimeChange }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const handleDateTimeChange = (dateTime: Date | null) => {
    setSelectedDateTime(dateTime);
    onDateTimeChange(dateTime);
  };

  return (
    <div className={styles.container}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Trip Date"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
        />
        <TimePicker
          label="Start Time"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
        />
      </LocalizationProvider>
    </div>
  );
};

export default TimeSelector;
