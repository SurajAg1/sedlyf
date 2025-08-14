"use client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    clearCart();
    router.push("/");
  };

  const goBack = () => router.back();

  const getTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <h2 className="text-3xl font-semibold mb-6">Checkout</h2>

      <button
        onClick={goBack}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back to Shop
      </button>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-3">
            {cart.map((item) => (
              <li key={`${item.id}-${item.color}-${item.size}`} className="border p-3 rounded">
                <div className="font-semibold">{item.name}</div>
                <div>Color: {item.color}, Size: {item.size}</div>
                <div>Quantity: {item.quantity}</div>
                <div>Price: ₹{item.price} x {item.quantity}</div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 font-semibold text-xl">
          Total: ₹{getTotal()}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Shipping Details</h3>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={handleInputChange}
          required
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleInputChange}
          required
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleInputChange}
          required
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingInfo.postalCode}
          onChange={handleInputChange}
          required
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={handleInputChange}
          required
          className="w-full p-2 border mb-6 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-semibold"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
