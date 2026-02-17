// frontend/src/pages/Products.jsx
// frontend/src/pages/Products.jsx

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import * as XLSX from "xlsx";
import { uploadImage } from "../api/upload";

const parseArrayField = (value) =>
  value
    ? String(value)
        .split(/[,;]+/)
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const [importResult, setImportResult] = useState(null);

  const [toggleAddProduct, setToggleAddProduct] = useState(false);

  const emptyForm = {
    name_ka: "",
    name_en: "",
    name_ru: "",

    brand: "",

    category_ka: "",
    category_en: "",
    category_ru: "",

    subCategory_ka: "",
    subCategory_en: "",
    subCategory_ru: "",

    price: "",
    salePrice: "",

    sku: "",
    barcode: "",
    volume: "",
    target: "unisex",

    description_ka: "",
    description_en: "",
    description_ru: "",

    ingredients_ka: "",
    ingredients_en: "",
    ingredients_ru: "",

    usage_ka: "",
    usage_en: "",
    usage_ru: "",

    hairType_ka: "",
    hairType_en: "",
    hairType_ru: "",

    skinType_ka: "",
    skinType_en: "",
    skinType_ru: "",

    images: [],
  };

  const [form, setForm] = useState(emptyForm);

  /* ======================================
     LOAD
  ====================================== */

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ======================================
     HELPERS
  ====================================== */

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const buildPayload = () => ({
    name: {
      ka: form.name_ka,
      en: form.name_en,
      ru: form.name_ru,
    },

    category: {
      ka: form.category_ka,
      en: form.category_en,
      ru: form.category_ru,
    },

    subCategory: {
      ka: form.subCategory_ka,
      en: form.subCategory_en,
      ru: form.subCategory_ru,
    },

    description: {
      ka: form.description_ka,
      en: form.description_en,
      ru: form.description_ru,
    },

    ingredients: {
      ka: form.ingredients_ka,
      en: form.ingredients_en,
      ru: form.ingredients_ru,
    },

    usage: {
      ka: form.usage_ka,
      en: form.usage_en,
      ru: form.usage_ru,
    },

    hairType: {
      ka: form.hairType_ka
        ? form.hairType_ka.split(",").map((x) => x.trim())
        : [],
      en: form.hairType_en
        ? form.hairType_en.split(",").map((x) => x.trim())
        : [],
      ru: form.hairType_ru
        ? form.hairType_ru.split(",").map((x) => x.trim())
        : [],
    },

    skinType: {
      ka: form.skinType_ka
        ? form.skinType_ka.split(",").map((x) => x.trim())
        : [],
      en: form.skinType_en
        ? form.skinType_en.split(",").map((x) => x.trim())
        : [],
      ru: form.skinType_ru
        ? form.skinType_ru.split(",").map((x) => x.trim())
        : [],
    },

    brand: form.brand,
    price: Number(form.price || 0),
    salePrice: Number(form.salePrice || 0),
    sku: form.sku,
    barcode: form.barcode,
    volume: form.volume,
    target: form.target,
    images: form.images,
  });

  /* ======================================
     SAVE
  ====================================== */

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = buildPayload();

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      loadProducts();
    } catch {
      alert("Save failed");
    }
  };

  /* ======================================
     EDIT
  ====================================== */

  const onEdit = (p) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setToggleAddProduct(true);
    setEditingId(p._id);

    setForm({
      name_ka: p.name?.ka || "",
      name_en: p.name?.en || "",
      name_ru: p.name?.ru || "",

      brand: p.brand || "",

      category_ka: p.category?.ka || "",
      category_en: p.category?.en || "",
      category_ru: p.category?.ru || "",

      subCategory_ka: p.subCategory?.ka || "",
      subCategory_en: p.subCategory?.en || "",
      subCategory_ru: p.subCategory?.ru || "",

      price: p.price ?? "",
      salePrice: p.salePrice ?? "",
      sku: p.sku || "",
      barcode: p.barcode || "",
      volume: p.volume || "",
      target: p.target || "unisex",

      description_ka: p.description?.ka || "",
      description_en: p.description?.en || "",
      description_ru: p.description?.ru || "",

      ingredients_ka: p.ingredients?.ka || "",
      ingredients_en: p.ingredients?.en || "",
      ingredients_ru: p.ingredients?.ru || "",

      usage_ka: p.usage?.ka || "",
      usage_en: p.usage?.en || "",
      usage_ru: p.usage?.ru || "",

      hairType_ka: p.hairType?.ka?.join(", ") || "",
      hairType_en: p.hairType?.en?.join(", ") || "",
      hairType_ru: p.hairType?.ru?.join(", ") || "",

      skinType_ka: p.skinType?.ka?.join(", ") || "",
      skinType_en: p.skinType?.en?.join(", ") || "",
      skinType_ru: p.skinType?.ru?.join(", ") || "",

      images: p.images || [],
    });
  };

  /* ======================================
     DELETE
  ====================================== */

  const onDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    await deleteProduct(id);
    loadProducts();
  };

  /* ======================================
     IMAGE UPLOAD
  ====================================== */

  const handleBulkImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const res = await uploadImage(files);
    setUploadedUrls(res.urls || []);
    setUploading(false);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    const res = await uploadImage(files);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...res.urls],
    }));

    setUploading(false);
  };

  /* ======================================
     EXCEL IMPORT
  ====================================== */

  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const parsedProducts = rows.map((r) => ({
      name: { ka: r.name_ka, en: r.name_en, ru: r.name_ru },
      category: { ka: r.category_ka, en: r.category_en, ru: r.category_ru },
      subCategory: {
        ka: r.subCategory_ka,
        en: r.subCategory_en,
        ru: r.subCategory_ru,
      },
      description: {
        ka: r.description_ka,
        en: r.description_en,
        ru: r.description_ru,
      },
      ingredients: {
        ka: r.ingredients_ka,
        en: r.ingredients_en,
        ru: r.ingredients_ru,
      },
      usage: { ka: r.usage_ka, en: r.usage_en, ru: r.usage_ru },

      hairType: {
        ka: parseArrayField(r.hairType_ka),
        en: parseArrayField(r.hairType_en),
        ru: parseArrayField(r.hairType_ru),
      },

      skinType: {
        ka: parseArrayField(r.skinType_ka),
        en: parseArrayField(r.skinType_en),
        ru: parseArrayField(r.skinType_ru),
      },

      brand: r.brand,
      price: Number(r.price || 0),
      salePrice: Number(r.salePrice || 0),
      sku: r.sku,
      barcode: r.barcode,
      volume: r.volume,
      target: r.target || "unisex",
      images: r.images?.split(",").map((x) => x.trim()) || [],
    }));

    const res = await fetch(`${import.meta.env.VITE_API_URL}/products/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify({ products: parsedProducts }),
    });

    const dataRes = await res.json();

    if (!res.ok) {
      alert(dataRes.error || "Import failed");
      return;
    }

    setImportResult(dataRes);

    loadProducts();
  };

  /* ======================================
     RENDER
  ====================================== */
  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;

    return obj.en || obj.ka || obj.ru || "";
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Products</h1>
        <button
          className={`px-3 py-1 rounded ${toggleAddProduct ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
          type="button"
          onClick={() => setToggleAddProduct(!toggleAddProduct)}
        >
          {toggleAddProduct ? "-" : "+"}
        </button>
      </div>
      {toggleAddProduct && (
        <div>
          {/* IMAGE URL GENERATOR */}
          <div className="rounded-lg bg-white p-4 shadow space-y-3">
            <h2 className="font-semibold">Upload Images → Get URLs</h2>
            <input type="file" multiple onChange={handleBulkImageUpload} />
            {uploading && <div>Uploading...</div>}

            {uploadedUrls.length > 0 && (
              <textarea
                readOnly
                value={uploadedUrls.join("\n")}
                className="w-full border rounded p-2 h-40 text-xs"
              />
            )}
          </div>

          {/* IMPORT */}
          <div className="rounded-lg bg-white p-4 shadow">
            <a
              href="/templates/products-import-template-multilang.xlsx"
              download
              className="bg-sky-200 px-3 py-1 rounded text-sm"
            >
              Download Excel Template
            </a>

            <input
              type="file"
              accept=".xlsx"
              onChange={handleExcelImport}
              className="ml-3"
            />
          </div>
          {importResult && (
            <div className="mt-3 rounded bg-green-50 border border-green-200 p-3 text-sm">
              <div className="font-semibold text-green-800">
                Import finished
              </div>

              <div>Inserted: {importResult.inserted}</div>
              <div>Skipped: {importResult.skipped}</div>

              {importResult.skippedBarcodes?.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium">Skipped barcodes:</div>
                  <div className="text-xs text-gray-700 max-h-32 overflow-auto">
                    {importResult.skippedBarcodes.join(", ")}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={onSubmit}
            className="bg-white p-4 rounded shadow space-y-3"
          >
            <Input
              name="name_ka"
              label="Name KA"
              value={form.name_ka}
              onChange={onChange}
            />
            <Input
              name="name_en"
              label="Name EN"
              value={form.name_en}
              onChange={onChange}
            />
            <Input
              name="name_ru"
              label="Name RU"
              value={form.name_ru}
              onChange={onChange}
            />

            <Input
              name="brand"
              label="Brand"
              value={form.brand}
              onChange={onChange}
            />

            <Input
              name="category_ka"
              label="Category KA"
              value={form.category_ka}
              onChange={onChange}
            />
            <Input
              name="category_en"
              label="Category EN"
              value={form.category_en}
              onChange={onChange}
            />
            <Input
              name="category_ru"
              label="Category RU"
              value={form.category_ru}
              onChange={onChange}
            />

            <Input
              name="subCategory_ka"
              label="SubCategory KA"
              value={form.subCategory_ka}
              onChange={onChange}
            />
            <Input
              name="subCategory_en"
              label="SubCategory EN"
              value={form.subCategory_en}
              onChange={onChange}
            />
            <Input
              name="subCategory_ru"
              label="SubCategory RU"
              value={form.subCategory_ru}
              onChange={onChange}
            />

            <Input
              name="price"
              label="Price"
              value={form.price}
              onChange={onChange}
            />
            <Input
              name="salePrice"
              label="Sale Price"
              value={form.salePrice}
              onChange={onChange}
            />
            <Input
              name="sku"
              label="SKU"
              value={form.sku}
              onChange={onChange}
            />
            <Input
              name="barcode"
              label="Barcode"
              value={form.barcode}
              onChange={onChange}
            />
            <Input
              name="volume"
              label="Volume"
              value={form.volume}
              onChange={onChange}
            />
            <select name="target" value={form.target} onChange={onChange}>
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
            <Input
              name="description_ka"
              label="Description KA"
              value={form.description_ka}
              onChange={onChange}
            />
            <Input
              name="description_en"
              label="Description EN"
              value={form.description_en}
              onChange={onChange}
            />
            <Input
              name="description_ru"
              label="Description RU"
              value={form.description_ru}
              onChange={onChange}
            />
            <Input
              name="ingredients_ka"
              label="Ingredients KA"
              value={form.ingredients_ka}
              onChange={onChange}
            />
            <Input
              name="ingredients_en"
              label="Ingredients EN"
              value={form.ingredients_en}
              onChange={onChange}
            />
            <Input
              name="ingredients_ru"
              label="Ingredients RU"
              value={form.ingredients_ru}
              onChange={onChange}
            />
            <Input
              name="usage_ka"
              label="Usage KA"
              value={form.usage_ka}
              onChange={onChange}
            />
            <Input
              name="usage_en"
              label="Usage EN"
              value={form.usage_en}
              onChange={onChange}
            />
            <Input
              name="usage_ru"
              label="Usage RU"
              value={form.usage_ru}
              onChange={onChange}
            />
            <Input
              name="hairType_ka"
              label="Hair Type KA (comma separated)"
              value={form.hairType_ka}
              onChange={onChange}
            />
            <Input
              name="hairType_en"
              label="Hair Type EN"
              value={form.hairType_en}
              onChange={onChange}
            />
            <Input
              name="hairType_ru"
              label="Hair Type RU"
              value={form.hairType_ru}
              onChange={onChange}
            />
            <Input
              name="skinType_ka"
              label="Skin Type KA"
              value={form.skinType_ka}
              onChange={onChange}
            />
            <Input
              name="skinType_en"
              label="Skin Type EN"
              value={form.skinType_en}
              onChange={onChange}
            />
            <Input
              name="skinType_ru"
              label="Skin Type RU"
              value={form.skinType_ru}
              onChange={onChange}
            />

            <div className="bg-gray-200 my-2 p-2 rounded space-y-2">
              <input type="file" multiple onChange={handleImageUpload} />

              {uploading && <div>Uploading...</div>}

              <div className="flex gap-2 flex-wrap bg-gray-200 p-2 rounded">
                {form.images?.map((img) => (
                  <div key={img} className="relative">
                    <img
                      src={img}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((i) => i !== img),
                        }))
                      }
                      className="absolute top-0 right-0 bg-black text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingId ? "Update" : "Create"}
            </button>
          </form>
        </div>
      )}
      {/* PRODUCT LIST */}
      <div className="rounded-lg bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="px-4 py-3">{getText(p.name)}</td>

                <td className="px-4 py-3">{p.brand}</td>

                <td className="px-4 py-3">{getText(p.category)}</td>

                <td className="px-4 py-3 text-right">{p.price}</td>

                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input {...props} className="border rounded px-2 py-1" />
    </div>
  );
}
