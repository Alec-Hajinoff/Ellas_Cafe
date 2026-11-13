import { useEffect, useState } from "react";
import { menuGet } from "./ApiService";
import "./FeaturedProducts.css";
import { Link } from "react-router-dom";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      try {
        const data = await menuGet();

        if (isMounted) {
          const shuffledProducts = [...data.products].sort(
            () => Math.random() - 0.5,
          );

          setFeaturedProducts(shuffledProducts.slice(0, 4));
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

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="featured-products"
      aria-labelledby="featured-products-heading"
    >
      <div className="featured-products-heading">
        <h2 id="featured-products-heading">A taste of Ellas</h2>
        <p>Some café favourites, chosen for you.</p>
      </div>

      {isLoading && <p role="status">Loading featured products…</p>}

      {!isLoading && errorMessage && (
        <p
          className="featured-products-message featured-products-error"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && featuredProducts.length === 0 && (
        <p className="featured-products-message">
          There are no products to feature yet.
        </p>
      )}

      {!isLoading && !errorMessage && featuredProducts.length > 0 && (
        <div className="featured-products-row row g-4">
          {featuredProducts.map((product) => (
            <div
              className="featured-products-item col-12 col-sm-6 col-lg-3"
              key={product.id}
            >
              <article className="featured-product-card h-100">
                {product.image_path ? (
                  <img
                    className="featured-product-image"
                    src={`${import.meta.env.VITE_API_BASE_URL}/Ellas_Cafe/${product.image_path}`}
                    alt={product.name}
                  />
                ) : (
                  <div
                    className="featured-product-image featured-product-image-placeholder"
                    aria-hidden="true"
                  />
                )}

                <div className="featured-product-details">
                  <div className="featured-product-title-row">
                    <h3>{product.name}</h3>
                    <span className="featured-product-price">
                      £{Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="featured-product-category">
                    {product.category}
                  </p>

                  {Array.isArray(product.dietary_tags) &&
                    product.dietary_tags.length > 0 && (
                      <ul
                        className="featured-product-tags"
                        aria-label="Dietary tags"
                      >
                        {product.dietary_tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <Link className="featured-products-menu-button" to="/Menu">
          View Our Menu
        </Link>
      </div>
    </section>
  );
}
