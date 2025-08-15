"use client";
export default function Header({ toggleCart, totalItems }) {
  return (
    <header className="fixed z-50 w-full p-4 bg-white shadow flex justify-between items-center">
      {/* Brand Name */}
      <h1 className="text-xl sm:text-2xl font-bold">Sadlyf</h1>

      {/* Cart Button */}
      <nav>
        <button
          onClick={toggleCart}
          className="cursor-pointer relative px-4 py-2 bg-black text-white rounded text-sm sm:text-base"
        >
          Cart ({totalItems})
        </button>
      </nav>
    </header>
  );
}
