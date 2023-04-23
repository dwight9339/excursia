import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import ActivitySearchForm from '../components/ActivitySearchForm';
import LocationSearch from '../components/LocationSearch';
import GridCheckbox from '../components/GridCheckbox';

describe('ActivitySearchForm', () => {
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    onSubmitMock.mockReset();
  });

  it('renders correctly', () => {
    render(<ActivitySearchForm onSubmit={onSubmitMock} />);

    expect(screen.getByTestId('activity-search-form')).toBeInTheDocument();
  });

  it('displays interests', () => {
    render(<ActivitySearchForm onSubmit={onSubmitMock} />);

    expect(screen.getByText('Interests')).toBeInTheDocument();
    expect(screen.getByLabelText('Restaurants')).toBeInTheDocument();
    expect(screen.getByLabelText('Cafés')).toBeInTheDocument();
  });

  it('disables submit if no location selected', async () => {
    render(<ActivitySearchForm onSubmit={onSubmitMock} />);

    fireEvent.change(screen.getByLabelText('Search Radius: 10 miles'), { target: { value: 20 } });
    userEvent.click(screen.getByLabelText('Restaurants'));
    expect(screen.getByText("Create Itinerary")).toBeDisabled();
  });
});
