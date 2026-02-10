import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="text-gray-600">
        Next step: products grid + filters + API integration.
      </p>
      <Link
        to="/products"
        className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white"
      >
        Browse Products
      </Link>
    </div>
  );
}
