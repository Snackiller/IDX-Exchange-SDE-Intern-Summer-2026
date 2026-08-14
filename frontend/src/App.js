import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import NaturalSearchPage from "./pages/NaturalSearchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ListingsPage />}
        />

        <Route
          path="/property/:id"
          element={<PropertyDetailPage />}
        />

        <Route
          path="/search/natural"
          element={<NaturalSearchPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;