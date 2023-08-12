import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ActivityList from '../../components/EditPage/ActivityList';

// Mock the react-beautiful-dnd dependencies
jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
    dragHandleProps: {},
  }, {}),
  DragDropContext: ({ children }) => <div>{children}</div>,
}));

describe('ActivityList', () => {
  const testActivities = [
    {
      name: 'Test Activity 1',
      allottedTime: 60,
      place: {
        place_id: '123',
        geometry: {
          location: {
            lat: 0,
            lng: 0,
          },
        },
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/museum-71.png",
      },
    },
    {
      name: 'Test Activity 2',
      allottedTime: 120,
      description: 'Test Description',
      location: {
        lat: 0,
        lng: 0,
      },
    },
  ];
  const mockOnReorder = jest.fn();
  const mockOnTimeUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <ActivityList
        activities={testActivities}
        onReorder={mockOnReorder}
        onTimeUpdate={mockOnTimeUpdate}
        onDelete={mockOnDelete}
      />
    );

    for (let activity of testActivities) {
      waitFor(() => expect(getByText(activity.name)).toBeInTheDocument());
    }
  });

  it("attaches proper link to activity name", async () => {
    const { getByText } = render(
      <ActivityList
        activities={testActivities}
        onReorder={mockOnReorder}
        onTimeUpdate={mockOnTimeUpdate}
        onDelete={mockOnDelete}
      />
    );

    waitFor(() => expect(getByText(testActivities[0].name).href).toBe(`https://www.google.com/maps/search/?api=1&query=${testActivities[0].place.geometry.lat}%2C${testActivities[0].place.geometry.lng}&query_place_id=${testActivities[0].place.place_id}`));
  });

  it("calls onDelete when delete button is clicked", async () => {
    const { findByTestId } = render(
      <ActivityList
        activities={testActivities}
        onReorder={mockOnReorder}
        onTimeUpdate={mockOnTimeUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = await findByTestId("activity-list--delete-button-activity-0");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
