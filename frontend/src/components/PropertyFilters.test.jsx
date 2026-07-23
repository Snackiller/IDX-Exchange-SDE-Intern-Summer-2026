import {
    fireEvent,
    render,
    screen,
  } from "@testing-library/react";
  import PropertyFilters from "./PropertyFilters";
  
  describe("PropertyFilters", () => {
    test("renders all six filter inputs", () => {
      render(
        <PropertyFilters
          onSearch={jest.fn()}
          onClear={jest.fn()}
        />
      );
  
      expect(
        screen.getByLabelText(/city/i)
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText(/zip code/i)
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText(/minimum price/i)
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText(/maximum price/i)
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText(/bedrooms/i)
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText(/bathrooms/i)
      ).toBeInTheDocument();
    });
  
    test("calls onSearch with the entered filter values", () => {
      const onSearch = jest.fn();
  
      render(
        <PropertyFilters
          onSearch={onSearch}
          onClear={jest.fn()}
        />
      );
  
      fireEvent.change(
        screen.getByLabelText(/city/i),
        {
          target: {
            value: "Beverly Hills",
          },
        }
      );
  
      fireEvent.change(
        screen.getByLabelText(/bedrooms/i),
        {
          target: {
            value: "3",
          },
        }
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: /search/i,
        })
      );
  
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          city: "Beverly Hills",
          beds: "3",
        })
      );
    });
  
    test("clears all fields and calls onClear", () => {
      const onClear = jest.fn();
  
      render(
        <PropertyFilters
          onSearch={jest.fn()}
          onClear={onClear}
        />
      );
  
      const cityInput =
        screen.getByLabelText(/city/i);
  
      fireEvent.change(cityInput, {
        target: {
          value: "Portland",
        },
      });
  
      fireEvent.click(
        screen.getByRole("button", {
          name: /clear filters/i,
        })
      );
  
      expect(cityInput).toHaveValue("");
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });