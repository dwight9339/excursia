import React, { ChangeEvent } from 'react';
import {
  Restaurant as RestaurantIcon,
  ShoppingBasket as ShoppingIcon,
  LocalMovies as EntertainmentIcon,
  NaturePeople as NatureIcon,
  Museum as MuseumIcon,
  History as HistoricalIcon,
  Church as ReligiousIcon,
  SportsSoccer as SportsIcon,
  LocalBar as NightlifeIcon,
  DirectionsRun as OutdoorIcon,
  Explore as SightseeingIcon
} from '@mui/icons-material';
import styles from "./InterestCheckbox.module.css";

interface InterestCheckboxProps {
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InterestCheckbox: React.FC<InterestCheckboxProps> = ({ name, onChange }) => {
  const interests = [
    { id: "1", label: "Restaurants", icon: <RestaurantIcon />, value: "restaurant" },
    { id: "2", label: "Shopping", icon: <ShoppingIcon />, value: "shopping" },
    { id: "3", label: "Entertainment", icon: <EntertainmentIcon />, value: "entertainment" },
    { id: "4", label: "Nature", icon: <NatureIcon />, value: "nature" },
    { id: "5", label: "Museums", icon: <MuseumIcon />, value: "museum" },
    { id: "6", label: "Historical", icon: <HistoricalIcon />, value: "historical" },
    { id: "7", label: "Religious", icon: <ReligiousIcon />, value: "religious" },
    { id: "8", label: "Sports", icon: <SportsIcon />, value: "sports" },
    { id: "9", label: "Nightlife", icon: <NightlifeIcon />, value: "nightlife" },
    { id: "10", label: "Outdoor", icon: <OutdoorIcon />, value: "outdoor" },
    { id: "11", label: "Sightseeing", icon: <SightseeingIcon />, value: "sightseeing" },
  ];

  return (
    <div className={styles.interestGrid}>
      {interests.map((interest) => (
        <label key={interest.id} className={styles.interestItem}>
          <input
            type="checkbox"
            name={name}
            value={interest.value}
            onChange={onChange}
          />
          <i>{interest.icon}</i>
          <span>{interest.label}</span>
        </label>
      ))}
    </div>
  );
};

export default InterestCheckbox;
