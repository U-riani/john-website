import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import Products from "./pages/Products";
import Warehouse from "./pages/Warehouse";
import StockLogs from "./pages/StockLogs";
import FailedOrders from "./pages/FailedOrders";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<OrdersList />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/stock-logs" element={<StockLogs />} />
                <Route path="/failed-orders" element={<FailedOrders />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
