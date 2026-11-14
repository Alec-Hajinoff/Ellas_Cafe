import React, { useCallback, useEffect, useState } from "react";
import AdminAddProducts from "./AdminAddProducts";
import AdminProductManager from "./AdminProductManager";
import { adminProductManagerGet } from "./ApiService";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const refreshProducts = useCallback(async () => {
    setProductsError("");

    try {
      const data = await adminProductManagerGet();
      setProducts(data.products);
    } catch (error) {
      setProductsError(error.message || "Products could not be loaded.");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 col-md-11 col-lg-10 mx-auto d-flex flex-column">
          <AdminAddProducts onProductAdded={refreshProducts} />
          <AdminProductManager
            products={products}
            setProducts={setProducts}
            isLoading={isLoadingProducts}
            error={productsError}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
