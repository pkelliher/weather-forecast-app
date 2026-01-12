import { render, screen } from "@testing-library/react";
import InvalidZipState from "../app/weather/invalid-zip-state";

describe("InvalidZipState", () => {
  it("renders error message with zip code", () => {
    render(<InvalidZipState zip="99999" />);
    expect(screen.getByText(/zip code not found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/we couldn’t find weather data for/i)
    ).toBeInTheDocument();
    expect(screen.getByText("99999")).toBeInTheDocument();
  });

  it("renders example location links", () => {
    render(<InvalidZipState zip="99999" />);
    expect(screen.getByText(/San Francisco/i)).toBeInTheDocument();
    expect(screen.getByText(/Beverly Hills/i)).toBeInTheDocument();
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
  });
});
