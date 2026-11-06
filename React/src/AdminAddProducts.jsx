import React, { useEffect, useState } from "react";
import { adminAddProducts } from "./ApiService";
import "./AdminAddProducts.css";

const CATEGORIES = [
  "Hot drinks",
  "Cold drinks",
  "Breakfast & brunch",
  "Lunch & sandwiches",
  "Pastries & baked goods",
  "Cakes & desserts",
];

const DIETARY_TAGS = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

function AdminAddProducts() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    price: "",
    category: "",
    dietaryTags: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!form.image) {
      setImagePreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(form.image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [form.image]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateImage = (event) => {
    const image = event.target.files?.[0] ?? null;
    setStatus({ type: "", message: "" });

    if (!image) {
      setForm((current) => ({ ...current, image: null }));
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
      setStatus({
        type: "error",
        message: "Choose a PNG, JPG, or WebP image.",
      });
      event.target.value = "";
      return;
    }

    if (image.size > MAX_IMAGE_BYTES) {
      setStatus({
        type: "error",
        message: "The image must be smaller than 2 MB.",
      });
      event.target.value = "";
      return;
    }

    setForm((current) => ({ ...current, image }));
  };

  const updateDietaryTag = (event) => {
    const { checked, value } = event.target;
    setForm((current) => ({
      ...current,
      dietaryTags: checked
        ? [...current.dietaryTags, value]
        : current.dietaryTags.filter((tag) => tag !== value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.category) {
      setStatus({ type: "error", message: "Please select a category." });
      return;
    }

    if (form.image && form.image.size > MAX_IMAGE_BYTES) {
      setStatus({
        type: "error",
        message: "The image must be smaller than 2 MB.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await adminAddProducts(form);

      if (!result.success) {
        throw new Error(result.message || "Product could not be added.");
      }

      setForm({
        name: "",
        description: "",
        ingredients: "",
        price: "",
        category: "",
        dietaryTags: [],
        image: null,
      });
      event.target.reset();
      setStatus({ type: "success", message: "Product added successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to add product.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="admin-add-products"
      aria-labelledby="add-product-heading"
    >
      <h2 id="add-product-heading">Add a product</h2>
      <p className="admin-add-products__intro">
        Add an item to the café menu. Name, price, and category are required.
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="admin-add-products__field">
          <label htmlFor="product-name">Product name</label>
          <input
            id="product-name"
            name="name"
            type="text"
            maxLength="255"
            value={form.name}
            onChange={updateField}
            required
          />
        </div>

        <div className="admin-add-products__field">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            name="description"
            rows="3"
            value={form.description}
            onChange={updateField}
          />
        </div>

        <div className="admin-add-products__field">
          <label htmlFor="product-ingredients">Ingredients</label>
          <textarea
            id="product-ingredients"
            name="ingredients"
            rows="3"
            value={form.ingredients}
            onChange={updateField}
          />
        </div>

        <div className="admin-add-products__field">
          <label htmlFor="product-price">Price (£)</label>
          <input
            id="product-price"
            name="price"
            type="number"
            min="0.01"
            max="99999999.99"
            step="0.01"
            value={form.price}
            onChange={updateField}
            required
          />
        </div>

        <fieldset className="admin-add-products__fieldset">
          <legend>
            Category <span>(choose one)</span>
          </legend>
          <div className="admin-add-products__options">
            {CATEGORIES.map((category) => (
              <label className="admin-add-products__option" key={category}>
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={form.category === category}
                  onChange={updateField}
                  required
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="admin-add-products__fieldset">
          <legend>
            Dietary tags <span>(choose any that apply)</span>
          </legend>
          <div className="admin-add-products__options">
            {DIETARY_TAGS.map((tag) => (
              <label className="admin-add-products__option" key={tag}>
                <input
                  type="checkbox"
                  name="dietaryTags"
                  value={tag}
                  checked={form.dietaryTags.includes(tag)}
                  onChange={updateDietaryTag}
                />
                {tag}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="admin-add-products__field">
          <label htmlFor="product-image">Product image</label>
          <input
            id="product-image"
            name="image"
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            onChange={updateImage}
          />
          <small>PNG, JPG, or WebP. Maximum file size: 2 MB.</small>
          {imagePreview && (
            <img
              className="admin-add-products__preview"
              src={imagePreview}
              alt="Preview of the selected product"
            />
          )}
        </div>

        {status.message && (
          <p
            className={`admin-add-products__message admin-add-products__message--${status.type}`}
            role={status.type === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>
        )}

        <button
          className="admin-add-products__submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding product…" : "Add product"}
        </button>
      </form>
    </section>
  );
}

export default AdminAddProducts;
