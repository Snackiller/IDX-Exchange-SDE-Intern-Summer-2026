import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import PropertyCard from "./PropertyCard";


const mockNavigate = jest.fn();


jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));


describe("PropertyCard", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });


  test("renders property information", () => {
    const property = {
      L_ListingID: "12345",
      L_Photos: JSON.stringify([
        "https://example.com/photo.jpg",
      ]),
      L_SystemPrice: 950000,
      L_Address: "123 Main Street",
      L_City: "Beverly Hills",
      L_State: "CA",
      L_Keyword2: 3,
      LM_Dec_3: 2.5,
      LM_Int2_3: 1800,
    };

    render(
      <PropertyCard property={property} />
    );

    expect(
      screen.getByText("$950,000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("123 Main Street")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Beverly Hills, CA")
    ).toBeInTheDocument();

    expect(
      screen.getByText("3 beds")
    ).toBeInTheDocument();

    expect(
      screen.getByText("2.5 baths")
    ).toBeInTheDocument();

    expect(
      screen.getByText("1,800 sqft")
    ).toBeInTheDocument();
  });


  test("navigates to the property detail page when clicked", () => {
    const property = {
      L_ListingID: "12345",
      L_Photos: "[]",
      L_SystemPrice: 500000,
      L_Address: "456 Oak Avenue",
      L_City: "Portland",
      L_State: "OR",
      L_Keyword2: 2,
      LM_Dec_3: 2,
      LM_Int2_3: 1200,
    };

    render(
      <PropertyCard property={property} />
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/property/12345"
    );
  });


  test("navigates to the property detail page when Enter is pressed", () => {
    const property = {
      L_ListingID: "12345",
      L_Photos: "[]",
      L_SystemPrice: 500000,
      L_Address: "456 Oak Avenue",
      L_City: "Portland",
      L_State: "OR",
      L_Keyword2: 2,
      LM_Dec_3: 2,
      LM_Int2_3: 1200,
    };

    render(
      <PropertyCard property={property} />
    );

    fireEvent.keyDown(
      screen.getByRole("button"),
      {
        key: "Enter",
        code: "Enter",
      }
    );

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/property/12345"
    );
  });


  test("navigates to the property detail page when Space is pressed", () => {
    const property = {
      L_ListingID: "12345",
      L_Photos: "[]",
      L_SystemPrice: 500000,
      L_Address: "456 Oak Avenue",
      L_City: "Portland",
      L_State: "OR",
      L_Keyword2: 2,
      LM_Dec_3: 2,
      LM_Int2_3: 1200,
    };

    render(
      <PropertyCard property={property} />
    );

    fireEvent.keyDown(
      screen.getByRole("button"),
      {
        key: " ",
        code: "Space",
      }
    );

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/property/12345"
    );
  });


  test("renders fallback values when property fields are missing", () => {
    const property = {
      L_ListingID: "999",
      L_Photos: null,
      L_SystemPrice: null,
      L_Address: null,
      L_City: null,
      L_State: null,
      L_Keyword2: null,
      LM_Dec_3: null,
      LM_Int2_3: null,
    };

    render(
      <PropertyCard property={property} />
    );

    expect(
      screen.getByText("Price unavailable")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Address unavailable")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Unknown city")
    ).toBeInTheDocument();

    expect(
      screen.getByText("— beds")
    ).toBeInTheDocument();

    expect(
      screen.getByText("— baths")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sqft unavailable")
    ).toBeInTheDocument();
  });
});