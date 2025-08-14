"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const router = useRouter();

  // Dummy product data (replace this with your actual product list or fetch logic)
  const products = [
    {
      id: 1,
      name: "Classic White Tee",
      price: 499,
      images: {
        White: "/images/white.jpg",
      },
    },
    {
      id: 2,
      name: "Black Minimal Tee",
      price: 599,
      images: {
        Black: "/images/black.jfif",
      },
    },
    // ... add other products here
  ];

  useEffect(() => {
    // Ensure router.query.id is defined before using it
    if (router.query?.id) {
      const productId = parseInt(router.query.id); // Assuming the route is /products/[id]
      const foundProduct = products.find((p) => p.id === productId);
      setProduct(foundProduct);
    }
  }, [router.query?.id]);

  if (!product) {
    return <div className="p-4 text-xl">Loading product details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={Object.values(product.images)[0]}
        alt={product.name}
        className="w-64 h-64 object-contain rounded shadow"
      />
      <p className="text-xl mt-4">Price: ₹{product.price}</p>
      <p className="text-gray-600 mt-2">Product ID: {product.id}</p>
    </div>
  );
}