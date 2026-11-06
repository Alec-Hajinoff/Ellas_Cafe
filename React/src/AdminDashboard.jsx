import React from "react";
import AdminAddProducts from "./AdminAddProducts";
import AdminProductManager from "./AdminProductManager";

function AdminDashboard() {
  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <AdminAddProducts />
      <AdminProductManager />
    </div>
  );
}

export default AdminDashboard;
