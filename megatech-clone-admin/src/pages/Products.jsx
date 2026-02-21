// frontend/src/pages/Products.jsx

import { useEffect, useRef, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import * as XLSX from "xlsx";
import { uploadImage } from "../api/upload";

// ✅ docx-preview: use renderAsync (NOT mammoth-style convertToHtml)
import { renderAsync } from "docx-preview";

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

  const [docNames, setDocNames] = useState({
    description_ka: "",
    description_en: "",
    description_ru: "",
    ingredients_ka: "",
    ingredients_en: "",
    ingredients_ru: "",
  });

  // used to force-remount file input when you want to reset it
  const [docInputKeys, setDocInputKeys] = useState({
    description_ka: 0,
    description_en: 0,
    description_ru: 0,
    ingredients_ka: 0,
    ingredients_en: 0,
    ingredients_ru: 0,
  });
  // ✅ hidden container used by docx-preview to render HTML
  const docxRenderRef = useRef(null);

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

    description_ka: "",
    description_en: "",
    description_ru: "",

    ingredients_ka: "",
    ingredients_en: "",
    ingredients_ru: "",

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
    } catch (err) {
      console.error(err);
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

  /**
   * ✅ DOCX -> rendered HTML via docx-preview
   * - renders docx into hidden container
   * - stores container.innerHTML into the selected field (description_ka/en/ru or ingredients_ka/en/ru)
   */
  const handleDocUpload = async (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (!file) return;

    // ✅ show filename and keep it visible
    setDocNames((prev) => ({ ...prev, [name]: file.name }));

    try {
      const container = docxRenderRef.current;
      if (!container) throw new Error("Missing docx render container");

      container.innerHTML = "";

      await renderAsync(file, container, null, {
        inWrapper: false,
        ignoreWidth: true,
        ignoreHeight: true,
      });

      const html = container.innerHTML;

      setForm((prev) => ({
        ...prev,
        [name]: html,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to parse Word document");
    }
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setImportResult(null);

    // clear visible filenames
    setDocNames({
      description_ka: "",
      description_en: "",
      description_ru: "",
      ingredients_ka: "",
      ingredients_en: "",
      ingredients_ru: "",
    });

    // force reset file inputs
    setDocInputKeys((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => (next[k] = next[k] + 1));
      return next;
    });
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

    brand: form.brand,
    price: Number(form.price || 0),
    salePrice: Number(form.salePrice || 0),
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
    } catch (err) {
      console.error(err);
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

      description_ka: p.description?.ka || "",
      description_en: p.description?.en || "",
      description_ru: p.description?.ru || "",

      ingredients_ka: p.ingredients?.ka || "",
      ingredients_en: p.ingredients?.en || "",
      ingredients_ru: p.ingredients?.ru || "",

      images: p.images || [],
    });
  };

  /* ======================================
     DELETE
  ====================================== */

  const onDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ======================================
     IMAGE UPLOAD
  ====================================== */

  const handleBulkImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);
      const res = await uploadImage(files);
      setUploadedUrls(res.urls || []);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);
      const res = await uploadImage(files);

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...(res.urls || [])],
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ======================================
     EXCEL IMPORT
  ====================================== */

  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buf = await file.arrayBuffer();
      const workbook = XLSX.read(buf);
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

        brand: r.brand,
        price: Number(r.price || 0),
        salePrice: Number(r.salePrice || 0),

        images: r.images?.split(",").map((x) => x.trim()) || [],
      }));

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
          body: JSON.stringify({ products: parsedProducts }),
        },
      );

      const dataRes = await res.json();

      if (!res.ok) {
        alert(dataRes.error || "Import failed");
        return;
      }

      setImportResult(dataRes);
      loadProducts();
      e.target.value = "";
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
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
          className={`px-3 py-1 rounded ${
            toggleAddProduct
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
          type="button"
          onClick={() => setToggleAddProduct(!toggleAddProduct)}
        >
          {toggleAddProduct ? "-" : "+"}
        </button>
      </div>

      {toggleAddProduct && (
        <div>
          {/* Hidden docx render container */}
          <div ref={docxRenderRef} className="hidden" />

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

            {/* DESCRIPTION DOCX UPLOADS */}
            <DocInput
              name="description_ka"
              label="Description KA (.docx)"
              fileName={docNames.description_ka}
              inputKey={docInputKeys.description_ka}
              onChange={handleDocUpload}
            />
            <DocInput
              name="description_en"
              label="Description EN (.docx)"
              fileName={docNames.description_en}
              inputKey={docInputKeys.description_en}
              onChange={handleDocUpload}
            />
            <DocInput
              name="description_ru"
              label="Description RU (.docx)"
              fileName={docNames.description_ru}
              inputKey={docInputKeys.description_ru}
              onChange={handleDocUpload}
            />

            {/* INGREDIENTS DOCX UPLOADS */}
            <DocInput
              name="ingredients_ka"
              label="Ingredients KA (.docx)"
              fileName={docNames.ingredients_ka}
              inputKey={docInputKeys.ingredients_ka}
              onChange={handleDocUpload}
            />
            <DocInput
              name="ingredients_en"
              label="Ingredients EN (.docx)"
              fileName={docNames.ingredients_en}
              inputKey={docInputKeys.ingredients_en}
              onChange={handleDocUpload}
            />
            <DocInput
              name="ingredients_ru"
              label="Ingredients RU (.docx)"
              fileName={docNames.ingredients_ru}
              inputKey={docInputKeys.ingredients_ru}
              onChange={handleDocUpload}
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

function DocInput({ label, name, fileName, inputKey, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input
        key={inputKey} // ✅ remount when key changes (resets selected file)
        type="file"
        accept=".docx"
        name={name}
        {...props}
        className="border rounded px-2 py-1"
      />
      {fileName ? (
        <div className="text-xs text-gray-600">Selected: {fileName}</div>
      ) : null}
    </div>
  );
}
