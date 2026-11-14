import React, { useState } from "react";
import { adminProductManagerPost } from "./ApiService";
import "./AdminProductManager.css";

function AdminProductManager({ products, setProducts, isLoading, error }) {
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" and its corresponding image?`,
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setMessage("");

    try {
      const data = await adminProductManagerPost(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id),
      );
      setMessage(data.message || "Product deleted.");
    } catch (deleteError) {
      window.alert(deleteError.message || "Product could not be deleted.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section
      className="admin-product-manager"
      aria-labelledby="product-manager-title"
    >
      <h2 id="product-manager-title">Remove products from your menu</h2>

      {error && (
        <p
          className="admin-product-manager__notice admin-product-manager__notice--error"
          role="alert"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          className="admin-product-manager__notice admin-product-manager__notice--success"
          role="status"
        >
          {message}
        </p>
      )}

      {isLoading ? (
        <p role="status">Loading products…</p>
      ) : products.length === 0 ? (
        <p>No products to display.</p>
      ) : (
        <div className="admin-product-manager__table-wrap">
          <table className="admin-product-manager__table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description || "—"}</td>
                  <td>
                    <button
                      className="admin-product-manager__delete"
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      aria-label={`Delete ${product.name}`}
                    >
                      {deletingId === product.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminProductManager;
