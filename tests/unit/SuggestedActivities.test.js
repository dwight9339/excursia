import { render, fireEvent } from '@testing-library/react';
import SuggestedActivities from '../../components/EditPage/SuggestedActivities';
import { useRouter } from 'next/router';


jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SuggestedActivities', () => {
  const mockSuggestions = [
    { name: 'Suggestion 1', place_id: '1', icon: 'http://testdomain.com/icon1' },
    { name: 'Suggestion 2', place_id: '2', icon: 'http://testdomain.com/icon2' },
  ];
  const mockSelectedActivities = ['1'];
  const mockHandleAddActivity = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      route: '/',
      pathname: '/',
      query: '',
      asPath: '/',
    });
  });

  it('renders the list of suggested activities correctly', () => {
    const { getByText, getByAltText } = render(
      <SuggestedActivities 
        selectedActivities={mockSelectedActivities} 
        suggestions={mockSuggestions} 
        handleAddActivity={mockHandleAddActivity} 
      />
    );

    mockSuggestions.forEach(suggestion => {
      const nameElement = getByText(suggestion.name);
      expect(nameElement).toBeInTheDocument();
      const iconElement = getByAltText(suggestion.name);
      expect(iconElement).toBeInTheDocument();
    });
  });

  // it('calls handleAddActivity with the correct argument when the add button is clicked', () => {
  //   const { getByText } = render(
  //     <SuggestedActivities 
  //       selectedActivities={mockSelectedActivities} 
  //       suggestions={mockSuggestions} 
  //       handleAddActivity={mockHandleAddActivity} 
  //     />
  //   );

  //   const addButton = getByText('Add');
  //   fireEvent.click(addButton);

  //   expect(mockHandleAddActivity).toHaveBeenCalledWith(mockSuggestions[1]);
  // });

  // it('disables the add button when the activity is already in the selectedActivities array', () => {
  //   const { getByText } = render(
  //     <SuggestedActivities 
  //       selectedActivities={mockSelectedActivities} 
  //       suggestions={mockSuggestions} 
  //       handleAddActivity={mockHandleAddActivity} 
  //     />
  //   );

  //   const addButton = getByText('Add');
  //   expect(addButton).toBeDisabled();
  // });
});
