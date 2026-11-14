import { useEffect, useState } from "react";
import { menuGet } from "./ApiService";
import "./Menu.css";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedDietaryTags, setSelectedDietaryTags] = useState([]);

  const CATEGORY_ORDER = [
    "breakfast & brunch",
    "lunch & sandwiches",
    "pastries & baked goods",
    "cakes & desserts",
    "hot drinks",
    "cold drinks",
  ];

  const DIETARY_TAGS = [
    "Vegan",
    "Vegetarian",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await menuGet();

        if (isMounted) {
          const displayedProducts = [...data.products].sort((a, b) => {
            const aCategory = String(a.category ?? "")
              .trim()
              .toLowerCase();
            const bCategory = String(b.category ?? "")
              .trim()
              .toLowerCase();

            const aOrder = CATEGORY_ORDER.indexOf(aCategory);
            const bOrder = CATEGORY_ORDER.indexOf(bCategory);

            return (
              (aOrder === -1 ? CATEGORY_ORDER.length : aOrder) -
              (bOrder === -1 ? CATEGORY_ORDER.length : bOrder)
            );
          });

          setProducts(displayedProducts);
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

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      String(product.category ?? "")
        .trim()
        .toLowerCase() === selectedCategory;

    const productTags = Array.isArray(product.dietary_tags)
      ? product.dietary_tags
      : [];

    const matchesDietaryTags = selectedDietaryTags.every((tag) =>
      productTags.includes(tag),
    );

    return matchesCategory && matchesDietaryTags;
  });

  const toggleDietaryTag = (tag) => {
    setSelectedDietaryTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  };

  return (
    <main className="menu-page">
      <h2>Explore our café menu</h2>

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
        <div className="menu-content">
          <aside className="menu-filters" aria-label="Menu filters">
            <h2>Categories</h2>

            <div className="menu-filter-options">
              {CATEGORY_ORDER.map((category) => (
                <button
                  className={`menu-filter-button${
                    selectedCategory === category ? " is-selected" : ""
                  }`}
                  type="button"
                  key={category}
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              className="menu-filter-clear"
              type="button"
              onClick={() => setSelectedCategory(null)}
              disabled={!selectedCategory}
            >
              Clear category
            </button>

            <fieldset className="menu-dietary-filter">
              <legend>Dietary tags</legend>

              <div className="menu-dietary-filter-options">
                {DIETARY_TAGS.map((tag) => (
                  <label className="menu-dietary-filter-option" key={tag}>
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selectedDietaryTags.includes(tag)}
                      onChange={() => toggleDietaryTag(tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>

              <button
                className="menu-filter-clear"
                type="button"
                onClick={() => setSelectedDietaryTags([])}
                disabled={selectedDietaryTags.length === 0}
              >
                Clear dietary tags
              </button>
            </fieldset>
          </aside>

          <section className="menu-product-list" aria-label="Café products">
            {visibleProducts.map((product) => (
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
                      <ul
                        className="menu-dietary-tags"
                        aria-label="Dietary tags"
                      >
                        {product.dietary_tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                </div>
              </article>
            ))}

            {visibleProducts.length === 0 && (
              <p className="menu-message">
                No products match the selected filters.
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
