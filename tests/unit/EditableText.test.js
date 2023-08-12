import { render, fireEvent } from '@testing-library/react';
import EditableText from '../../components/EditableText';

describe('EditableText', () => {
  const mockText = 'Test text';
  const mockOnEdit = jest.fn();

  it('renders the text field correctly', () => {
    const { getByText } = render(<EditableText text={mockText} onEdit={mockOnEdit} />);

    const textField = getByText(mockText);
    expect(textField).toBeInTheDocument();
  });

  it("Shows the edit button when the text field is hovered over", () => {
    const { getByTestId } = render(<EditableText text={mockText} onEdit={mockOnEdit} />);
    const textField = getByTestId("editable-text-container");
    fireEvent.mouseOver(textField);
    const editButton = getByTestId("edit-button");
    expect(editButton).toBeInTheDocument();
  });

  it("Doesn't show the edit button when the text field is not hovered over", () => {
    const { getByTestId, queryByTestId } = render(<EditableText text={mockText} onEdit={mockOnEdit} />);
    const textField = getByTestId("editable-text-container");
    fireEvent.mouseLeave(textField);
    const editButton = queryByTestId("edit-button");
    expect(editButton).not.toBeInTheDocument();
  });

  it('renders the input field correctly when editing', () => {
    const { getByTestId } = render(<EditableText text={mockText} onEdit={mockOnEdit} />);

    const textField = getByTestId("editable-text-text");
    fireEvent.mouseOver(textField);
    const editButton = getByTestId("edit-button");
    fireEvent.click(editButton);

    const inputField = getByTestId("editable-text-input");
    expect(inputField).toBeInTheDocument();
    expect(textField).not.toBeInTheDocument();
    expect(editButton).not.toBeInTheDocument();
  });

  it('updates value when the input field is changed', () => {
    const { getByTestId, getByDisplayValue } = render(<EditableText text={mockText} onEdit={mockOnEdit} />);

    const textField = getByTestId("editable-text-text");
    fireEvent.mouseOver(textField);
    const editButton = getByTestId("edit-button");
    fireEvent.click(editButton);

    const inputField = getByTestId("editable-text-input");
    fireEvent.change(inputField, { target: { value: 'New text' } });

    expect(getByDisplayValue('New text')).toBeInTheDocument();
  });

  it('saves the changes and sets editing to false when the input field loses focus', () => {
    const { getByTestId } = render(<EditableText text={mockText} onEdit={mockOnEdit} />);

    const textField = getByTestId("editable-text-text");
    fireEvent.mouseOver(textField);
    const editButton = getByTestId("edit-button");
    fireEvent.click(editButton);

    const inputField = getByTestId("editable-text-input");
    fireEvent.change(inputField, { target: { value: 'New text' } });
    fireEvent.blur(inputField);

    expect(inputField).not.toBeInTheDocument();
    expect(mockOnEdit).toHaveBeenCalledWith('New text');

    const newTextField = getByTestId("editable-text-text");
    expect(newTextField).toBeInTheDocument();
  });

  it('saves the changes and sets editing to false when the enter key is pressed', () => {
    const { getByTestId } = render(<EditableText text={mockText} onEdit={mockOnEdit} />);

    const textField = getByTestId("editable-text-text");
    fireEvent.mouseOver(textField);
    const editButton = getByTestId("edit-button");
    fireEvent.click(editButton);

    const inputField = getByTestId("editable-text-input");
    fireEvent.change(inputField, { target: { value: 'New text' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 13, charCode: 13 });

    expect(inputField).not.toBeInTheDocument();
    expect(mockOnEdit).toHaveBeenCalledWith('New text');

    const newTextField = getByTestId("editable-text-text");
    expect(newTextField).toBeInTheDocument();
  });
});
