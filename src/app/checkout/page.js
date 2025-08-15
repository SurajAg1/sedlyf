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
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    state: "",
    country: "",
  });
 const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const generateEmailTemplate = (orderDetails) => {
    const { cart, shippingInfo, total } = orderDetails;
  
    const {
      name,
      address,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
    } = shippingInfo;
  
    const fullAddress = [address, address1, address2, city, state, postalCode, country]
      .filter(Boolean)
      .join(", ");
  
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #000;">Order Confirmation</h2>
        <p>Thank you for your order, ${name}!</p>
        
        <h3>Shipping Details:</h3>
        <p>
          <strong>Address:</strong> ${fullAddress}<br>
          <strong>Phone:</strong> ${phone}<br>
          <strong>Email:</strong> ${shippingInfo.email}
        </p>
        
        <h3>Order Summary:</h3>
        <ul style="list-style: none; padding: 0;">
          ${cart
            .map(
              (item) => `
            <li style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
              <strong>${item.name}</strong><br>
              Color: ${item.color}, Size: ${item.size}<br>
              Quantity: ${item.quantity}<br>
              Price: ₹${item.price} x ${item.quantity}
            </li>
          `
            )
            .join("")}
        </ul>
        
        <h3>Total: ₹${total}</h3>
        
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>Your T-Shirt Store</p>
      </div>
    `;
  };
  
  
  const handlePostalCodeChange = async (e) => {
    const postalCode = e.target.value;
  
    setShippingInfo((prev) => ({
      ...prev,
      postalCode,
    }));
  
    if (postalCode.length >= 5) {
      try {
        const response = await fetch(`https://api.zippopotam.us/in/${postalCode}`);
  
        if (!response.ok) {
          console.warn("Postal code not found in API:", postalCode);
          return;
        }
  
        const data = await response.json();
        const place = data.places[0];
  
        setShippingInfo((prev) => ({
          ...prev,
          city: place['place name'],
          state: place['state'],
          country: data.country,
        }));
      } catch (error) {
        console.error("Postal code lookup failed:", error);
      }
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Destructure shippingInfo
    const { name, address, city, postalCode, phone, email } = shippingInfo;
  
    // Validation regex
    const phoneRegex = /^\+?[0-9\s\-().]{7,}$/;
    const postalCodeRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Validation checks
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }
  
    if (!address.trim() || !city.trim()) {
      alert("Please enter a valid address and city.");
      return;
    }
  
    if (!postalCodeRegex.test(postalCode)) {
      alert("Please enter a valid postal code.");
      return;
    }
  
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
  
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    setLoading(true);

    // Build order
    const orderDetails = {
      cart: cart.map((item) => ({
        name: item.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingInfo,
      total: getTotal(),
    };
  
    const emailTemplate = generateEmailTemplate(orderDetails);
  
    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...orderDetails, emailTemplate }),
      });
  
      if (response.ok) {
        alert("Order placed successfully!");
        clearCart();
        router.push("/");
      } else {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          alert(`Failed to place order: ${errorData.error}`);
        } catch {
          alert(`Failed to place order: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
    setLoading(false);
  };
  
  const goBack = () => router.back();

  const getTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="flex gap-4 items-center mb-6">
      <button
        onClick={goBack}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        tooltip="Go Back"
      >←</button>
      <h2 className="text-3xl font-semibold mb-6">Checkout</h2>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-3 flex flex-wrap gap-4">
            {cart.map((item) => (
              <li key={`${item.id}-${item.color}-${item.size}`} className="border p-3 rounded w-fit">
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
          autoComplete="name"
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address Line 1"
          value={shippingInfo.address}
          onChange={handleInputChange}
          required
          autoComplete="street-address"
          className=
          "w-full p-2 border mb-4 rounded"
        />
        <input
          type="text"
          name="address1"
          placeholder="Address Line 2"
          value={shippingInfo.address1}
          onChange={handleInputChange}
          autoComplete="street-address"
          className=
          "w-full p-2 border mb-4 rounded"
        />
        <input
          type="text"
          name="address2"
          placeholder="Address Line 3"
          value={shippingInfo.address2}
          onChange={handleInputChange}
          autoComplete="street-address"
          className=
          "w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingInfo.postalCode}
          onChange={handlePostalCodeChange}
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
          autoComplete="address-level2"
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={shippingInfo.state}
          onChange={handleInputChange}
          required
          autoComplete="address-level1"
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingInfo.country}
          onChange={handleInputChange}
          required
          autoComplete="country-name"
          className="w-full p-2 border mb-4 rounded"
        />


        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={handleInputChange}
          required
          pattern="^\+?[0-9\s\-().]{7,}$"
          title="Phone number must be at least 7 digits and can include +, -, spaces, or parentheses"
          autoComplete="tel"
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={shippingInfo.email}
          onChange={handleInputChange}
          required
          autoComplete="email"
          className="w-full p-2 border mb-6 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition cursor-pointer flex items-center justify-center"
           disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Place Order"
          )}
        </button>
      </form>
    </div>
  );
}
