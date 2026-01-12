import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../app/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Home page", () => {
  it("renders input and button", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<Home />);
    expect(screen.getByPlaceholderText(/enter zip code/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get forecast/i })
    ).toBeInTheDocument();
  });

  it("shows error for invalid zip", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<Home />);
    const input = screen.getByPlaceholderText(/enter zip code/i);

    fireEvent.change(input, { target: { value: "123" } });
    expect(screen.getByText(/zip code must be 5 digits/i)).toBeInTheDocument();
  });

  it("navigates to /weather/[zip] when valid zip entered", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<Home />);
    const input = screen.getByPlaceholderText(/enter zip code/i);
    const button = screen.getByRole("button", { name: /get forecast/i });

    fireEvent.change(input, { target: { value: "94102" } });
    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/weather/94102");
  });
});
