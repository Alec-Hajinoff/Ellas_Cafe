import { useEffect, useState } from "react";
import { menuGet } from "./ApiService";
import "./Menu.css";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await menuGet();

        if (isMounted) {
          setProducts(data.products);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="menu-page">
      <h1>Our Menu</h1>
      <p>Explore our café menu.</p>

      {isLoading && <p role="status">Loading menu…</p>}

      {!isLoading && errorMessage && (
        <p className="menu-message menu-error" role="alert">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && products.length === 0 && (
        <p className="menu-message">There are no products to display yet.</p>
      )}

      {!isLoading && !errorMessage && products.length > 0 && (
        <section className="menu-product-list" aria-label="Café products">
          {products.map((product) => (
            <article className="menu-product" key={product.id}>
              {product.image_path && (
                <img
                  className="menu-product-image"
                  src={`${import.meta.env.VITE_API_BASE_URL}/Ellas_Cafe/${product.image_path}`}
                  alt={product.name}
                />
              )}

              <div className="menu-product-details">
                <div className="menu-product-heading">
                  <h2>{product.name}</h2>
                  <span className="menu-product-price">
                    £{Number(product.price).toFixed(2)}
                  </span>
                </div>

                <p className="menu-product-category">{product.category}</p>

                {product.description && <p>{product.description}</p>}

                {product.ingredients && (
                  <p className="menu-product-ingredients">
                    <strong>Ingredients:</strong> {product.ingredients}
                  </p>
                )}

                {Array.isArray(product.dietary_tags) &&
                  product.dietary_tags.length > 0 && (
                    <ul className="menu-dietary-tags" aria-label="Dietary tags">
                      {product.dietary_tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
