import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import HeaderNav from "./pages/HeaderNav";

function App() {
  return (
    <div className="centering">
      <HeaderNav></HeaderNav>

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
