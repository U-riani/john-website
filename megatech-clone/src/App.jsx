import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopLayout from "./layouts/ShopLayout";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Chekout from "./pages/Checkout";
import OrderForClient from "./pages/OrderForClient";

export default function App() {
  return (
    <ShopLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/order/:orderId" element={<OrderForClient />} />
        <Route path="/checkout" element={<Chekout />} />
      </Routes>
    </ShopLayout>
  );
}
