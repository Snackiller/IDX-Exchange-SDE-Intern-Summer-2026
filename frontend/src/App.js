import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import NaturalSearchPage from "./pages/NaturalSearchPage";

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;