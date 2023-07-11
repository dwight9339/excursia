import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GridCheckbox from '../components/ActivitySearch/GridCheckbox';

describe('GridCheckbox', () => {
  const mockOnChange = jest.fn();
  const mockItems = [
    { id: '1', label: 'Test 1', img: '/test1.png', value: 'test1' },
    { id: '2', label: 'Test 2', img: '/test2.png', value: 'test2' },
  ];
  const mockInterestList = ['test1'];

  test('renders without crashing', () => {
    const { getByRole } = render(
      <GridCheckbox 
        name="test"
        onChange={mockOnChange}
        items={mockItems}
        interestList={mockInterestList}
        device="desktop"
      />
    );

    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  test('calls onChange when checkbox is clicked', () => {
    const { getByRole } = render(
      <GridCheckbox 
        name="test"
        onChange={mockOnChange}
        items={mockItems}
        interestList={mockInterestList}
        device="desktop"
      />
    );

    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('renders correct number of checkboxes', () => {
    const { getByRole } = render(
      <GridCheckbox 
        name="test"
        onChange={mockOnChange}
        items={mockItems}
        interestList={mockInterestList}
        device="desktop"
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(mockItems.length);
  });
});
