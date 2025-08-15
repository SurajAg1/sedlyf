"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import tshirts from "@/data/tshirtsData";

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const searchParams = useSearchParams(); // Hook to access query parameters
  const selectedColor = searchParams.get("color"); // Retrieve the 'color' query parameter

  useEffect(() => {
    async function fetchParams() {
      const unwrappedParams = await params; // Unwrap the params Promise
      const productId = parseInt(unwrappedParams.id); // Extract the id from the route parameters
      const foundProduct = tshirts.find((p) => p.id === productId);
      setProduct(foundProduct);
    }
    fetchParams();
  }, [params]);

  if (!product) {
    return <div className="p-4 text-xl">Loading product details...</div>;
  }
  const normalizedColor = selectedColor?.trim(); // Ensure no extra spaces
  const imageKey = Object.keys(product.images).find(
    (key) => key.toLowerCase() === normalizedColor?.toLowerCase()
  );
  const imageSrc = product.images[imageKey] || Object.values(product.images)[0];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={imageSrc}
        alt={product.name}
        className="w-64 h-64 object-contain rounded shadow"
      />
      <p className="text-xl mt-4">Price: ₹{product.price}</p>
      <p className="text-gray-600 mt-2">Selected Color: {selectedColor || "Default"}</p>
    </div>
  );
}