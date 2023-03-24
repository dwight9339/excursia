import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import {
  IconButton
} from "@mui/material";
 

interface ActivityListProps {
  activities: Activity[],
  onReorder: (startIndex: number, endIndex: number) => void;
  onDelete: (index: number) => void;
}

interface ListItemProps {
  activity: Activity;
  index: number;
  onDelete: (index: number) => void;
}

const ListItem: React.FC<ListItemProps> = ({ activity, index, onDelete }) => {
  return (
    <>
      <p>{activity.name}</p>
      <p>{activity.allottedTime}</p>
      <IconButton edge="end" onClick={() => onDelete(index)}>
        <DeleteIcon />
      </IconButton>
    </>
  )
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onReorder, onDelete }) => {
  const keyedActivities = activities.map((activity: Activity, i: number) => {
    return {id: `${i}`, ...activity};
  })
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="activityList">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {keyedActivities.map((activity, index) => (
              <Draggable key={activity.id} draggableId={activity.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ListItem
                      activity={activity}
                      index={index}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 

export default ActivityList;