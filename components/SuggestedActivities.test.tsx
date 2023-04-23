import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SuggestedActivities from '../components/SuggestedActivities';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
 
describe('SuggestedActivities', () => {
  const handleAddActivityMock = jest.fn();

  const sampleSuggestions = [
    {
      place_id: '1',
      name: 'Activity 1',
      icon: 'https://example.com/icon1.png',
    },
    {
      place_id: '2',
      name: 'Activity 2',
      icon: 'https://example.com/icon2.png',
    },
  ];

  it('renders suggestions', () => {
    render(
      <SuggestedActivities
        selectedActivities={[]}
        suggestions={sampleSuggestions}
        handleAddActivity={handleAddActivityMock}
      />
    );

    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Activity 2')).toBeInTheDocument();
  });

  it('disables add button if the activity is already selected', () => {
    render(
      <SuggestedActivities
        selectedActivities={['1']}
        suggestions={sampleSuggestions}
        handleAddActivity={handleAddActivityMock}
      />
    );

    const addButton1 = screen.getAllByRole('button')[0];
    const addButton2 = screen.getAllByRole('button')[1];

    expect(addButton1).toBeDisabled();
    expect(addButton2).not.toBeDisabled();
  });

  it('calls handleAddActivity when clicking the add button', () => {
    render(
      <SuggestedActivities
        selectedActivities={[]}
        suggestions={sampleSuggestions}
        handleAddActivity={handleAddActivityMock}
      />
    );

    const addButton1 = screen.getAllByRole('button')[0];
    fireEvent.click(addButton1);

    expect(handleAddActivityMock).toHaveBeenCalledTimes(1);
    expect(handleAddActivityMock).toHaveBeenCalledWith(sampleSuggestions[0]);
  });
});