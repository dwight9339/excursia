import React, { useEffect } from "react";
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import {
  IconButton
} from "@mui/material";
import type { DraggableProvided } from "react-beautiful-dnd";
import Image from "next/image";
import styles from "../styles/ActivityList.module.scss";
import EditableText from "./EditableText";
import hash from "object-hash";
import dynamic from "next/dynamic";
 
interface ActivityListProps {
  activities: Activity[],
  onReorder: (startIndex: number, endIndex: number) => void;
  onTimeUpdate: (index: number, newTime: number) => void;
  onDelete: (index: number) => void;
}

interface ListItemProps {
  activity: Activity;
  index: number;
  provided: DraggableProvided;
  onTimeUpdate: (index: number, newTime: number) => void;
  onDelete: (index: number) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  activity,
  index,
  provided,
  onTimeUpdate,
  onDelete
}) => {
  const placeId = activity.place?.place_id;
  const lat = activity.place?.geometry?.location?.lat || activity.location?.lat;
  const lng = activity.place?.geometry?.location?.lng || activity.location?.lng;
  const placeLink = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}${placeId ? `&query_place_id=${placeId} ` : ""}`;

  return (
    <div
      className={styles.listItem}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div
        className={styles.dragHandle}
        {...provided.dragHandleProps}
      >
          <Image
            src="/images/drag.png"
            alt="Drag to reorder"
            width={20}
            height={20}
          />
      </div> 
      <div 
        className={styles.infoContainer}
      >
        <span 
          className={styles.activityImage}
        >
          {activity.place && <Image
            src={`${activity.place.icon}`}
            alt={activity.name}
            width={70}
            height={70}
          />}
        </span>
        <span 
          className={styles.activityName}
        >
           { placeLink
              ? <a href={placeLink} target="_blank">{activity.name}</a>
              : <span>{activity.name}</span>
            }
        </span>
        <span 
          className={styles.activityTime}
        >
          <EditableText
            text={activity.allottedTime.toString()}
            numeric
            onEdit={(newTime) => onTimeUpdate(index, parseInt(newTime))}
          />
          mins
        </span>
      </div>
      <div
        className={styles.deleteButton}
        onClick={() => onDelete(index)}
      >
        <Image
          src="/images/delete.png"
          alt="Delete activity"
          width={20}
          height={20}
        />
      </div>
    </div>
  )
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onReorder,
  onTimeUpdate,
  onDelete
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    onReorder(result.source.index, result.destination.index);
  };

  if (!activities?.length) return (
    <div className={styles.listRegion}>
      <p className={styles.emptyListMessage}>Add some activities to get started!</p>
    </div>
  );

  const DragDropContext = dynamic(
    () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
    { ssr: false }
  );

  const Droppable = dynamic(
    () => import('react-beautiful-dnd').then(mod => mod.Droppable),
    { ssr: false }
  );

  const Draggable = dynamic(
    () => import('react-beautiful-dnd').then(mod => mod.Draggable),
    { ssr: false }
  ); 

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="activityList">
        {(provided) => (
          <div 
            className={styles.listRegion}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {activities.map((activity, index) => {
              const draggableId = activity.place?.place_id || hash({ index, name: activity.name });

              return (
                <Draggable key={draggableId} draggableId={draggableId} index={index}>
                  {(provided) => (
                    <ListItem
                      activity={activity}
                      index={index}
                      provided={provided}
                      onTimeUpdate={onTimeUpdate}
                      onDelete={onDelete}
                    />
                    // <div
                    //   ref={provided.innerRef}
                    //   {...provided.draggableProps}
                    //   {...provided.dragHandleProps}
                    // >
                    //   {activity.name}
                    // </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 

export default ActivityList;