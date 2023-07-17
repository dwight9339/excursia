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
    const { getByTestId, getByText } = render(
      <GridCheckbox 
        name="test"
        onChange={mockOnChange}
        items={mockItems}
        interestList={mockInterestList}
        device="desktop"
      />
    );

    for (let item of mockItems) {
      const checkbox = getByTestId(`grid-checkbox--box-${item.value}`);
      const label = getByText(item.label);
      expect(checkbox).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    }
  });

  test('calls onChange when checkbox is clicked', () => {
    const { getByTestId } = render(
      <GridCheckbox 
        name="test"
        onChange={mockOnChange}
        items={mockItems}
        interestList={mockInterestList}
        device="desktop"
      />
    );

    const checkbox = getByTestId(`grid-checkbox--box-${mockItems[0].value}`);
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('renders correct number of checkboxes', () => {
    const { queryAllByTestId } = render(
      <GridCheckbox 
        name="test"
        onChange={mockOnChange}
        items={mockItems}
        interestList={mockInterestList}
        device="desktop"
      />
    );

    const checkboxes = queryAllByTestId(/grid-checkbox--box-/);
    expect(checkboxes.length).toBe(mockItems.length);
  });
});
