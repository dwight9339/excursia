import { render, fireEvent } from "@testing-library/react";
import OptionsButton from "../components/OptionsButton";

describe("OptionsButton", () => {
  const mockOptions = [
    { name: "Option 1", onClick: jest.fn() },
    { name: "Option 2", onClick: jest.fn() },
  ];

  it("renders the button correctly", () => {
    const { getByTestId } = render(<OptionsButton options={mockOptions} />);

    const button = getByTestId("options-button");
    const buttonIcon = getByTestId("options-button-icon");
    expect(button).toBeInTheDocument();
    expect(buttonIcon).toBeInTheDocument();
  });

  it("renders the options when the button is clicked", () => {
    const { getByTestId, getByText } = render(<OptionsButton options={mockOptions} />);

    const button = getByTestId("options-button");
    fireEvent.click(button);

    mockOptions.forEach((option) => {
      const optionElement = getByText(option.name);
      expect(optionElement).toBeInTheDocument();
    });
  });

  it("closes the options and calls the option's onClick function when an option is clicked", () => {
    const { getByTestId, getByText } = render(<OptionsButton options={mockOptions} />);

    const button = getByTestId("options-button");
    fireEvent.click(button);

    const option1 = getByText(mockOptions[0].name);
    fireEvent.click(option1);

    expect(mockOptions[0].onClick).toHaveBeenCalled();
    expect(() => getByText(mockOptions[0].name)).toThrow();
  });
});
