"use client";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import PhotoSlider from "./components/PhotoSlider";
import tshirts from "../data/tshirtsData";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleColorChange = (id, color) => {
    setSelectedOptions((prev) => {
      const existing = prev[id] || { size: "M" };
      return {
        ...prev,
        [id]: { ...existing, color },
      };
    });
  };

  const handleSizeChange = (id, size) => {
    setSelectedOptions((prev) => {
      const existing = prev[id] || { color: "White" };
      return {
        ...prev,
        [id]: { ...existing, size },
      };
    });
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const totalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const initialOptions = {};
    tshirts.forEach((shirt) => {
      initialOptions[shirt.id] = { color: "White", size: "M" };
    });
    setSelectedOptions(initialOptions);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      <Header toggleCart={toggleCart} totalItems={totalItems()} />

      <main className="">
        <PhotoSlider />
        <div className="p-8">
        <h2 className="text-3xl font-semibold mb-6 mt-10">Our T-Shirts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tshirts.map((shirt) => {
            const selected = selectedOptions[shirt.id] || {
              color: "White",
              size: "M",
            };
            const cartItem = cart.find(
              (item) =>
                item.id === shirt.id &&
                item.color === selected.color &&
                item.size === selected.size
            );
            const quantity = cartItem ? cartItem.quantity : 0;
            return (
              <ProductCard
                key={shirt.id}
                shirt={shirt}
                selected={selected}
                handleColorChange={handleColorChange}
                handleSizeChange={handleSizeChange}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                quantity={quantity}
                cart={cart}
              />
            );
          })}
        </div>
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        cart={cart}
        toggleCart={toggleCart}
        removeFromCart={removeFromCart}
        getTotal={getTotal}
      />

      <Footer />
    </div>
  );
}
