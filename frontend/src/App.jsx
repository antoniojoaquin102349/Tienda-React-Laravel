<<<<<<< Updated upstream
import UsersList from './components/UsersList';

function App() {
  return (
    <div>
      <h1>Mi Frontend React</h1>
      <UsersList />
    </div>
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Layout/Header";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import PurchasesPage from "./pages/PurchasesPage";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
>>>>>>> Stashed changes
  );
}

export default App;