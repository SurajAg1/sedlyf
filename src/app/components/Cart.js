"use client";
import { useRouter } from "next/navigation";
export default function Cart({
  isOpen,
  cart,
  toggleCart,
  removeFromCart,
  getTotal,
}) {
    const router = useRouter();
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-50" onClick={toggleCart}></div>
      <div className="fixed top-0 right-0 w-80 h-screen bg-white shadow-lg p-6 z-50 ">
        <h3 className="text-2xl font-bold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : ( 
          <div className="flex flex-col h-full">
            <div className="above part overflow-y-auto pb-4 p-2 bg-gray-100 rounded-lg max-h-[80%]">
              <div className="">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-600 text-sm">
                    Color: {item.color}, Size: {item.size}
                  </p>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-black">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.color, item.size)
                    }
                    className="text-red-600 text-sm mt-2 hover:underline hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            </div>
            </div>
            <div className="below part mb-12 ">
            <div className="border-t pt-4 mt-4 flex justify-between">
              <p className="font-semibold">Total:</p>
              <p className="font-semibold">₹{getTotal()}</p>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="cursor-pointer mt-4 w-full px-4 py-2 bg-black text-white rounded"
            >
              Checkout
            </button>
            </div>
          </div>
        )}
        <button
          onClick={toggleCart}
          className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
      </div>
    </>
  );
}
