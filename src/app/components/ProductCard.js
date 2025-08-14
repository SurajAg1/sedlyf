"use client";
import { useRouter } from "next/navigation";

export default function ProductCard({
  shirt,
  selected,
  handleColorChange,
  handleSizeChange,
  addToCart,
  updateQuantity,
  quantity,
  cart,
}) {
        const router = useRouter();
    
  // Get total quantity for a color
  const getQuantityForColor = (color) => {
    return cart
      .filter((item) => item.id === shirt.id && item.color === color)
      .reduce((total, item) => total + item.quantity, 0);
  };

  // Get quantity for a size within the selected color
  const getQuantityForSize = (size) => {
    return cart
      .filter(
        (item) =>
          item.id === shirt.id &&
          item.color === selected.color &&
          item.size === size
      )
      .reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div 
    onClick={() => router.push('/products/' + shirt.id)}>
    <div className="border rounded-lg p-4 shadow bg-white">
      <img
        src={shirt.images[selected.color]}
        alt={shirt.name}
        className="w-full h-48 sm:h-60 object-contain rounded"
      />
      <h3 className="mt-4 text-lg sm:text-xl font-medium">{shirt.name}</h3>
      <p className="text-gray-600 text-sm sm:text-base">₹{shirt.price}</p>

      {/* Color Selector */}
      <div className="mt-2">
        <label className="text-sm sm:text-base font-medium">Color:</label>
        <div className="flex gap-2 mt-2">
          {shirt.colors.map((color) => (
            <div
              key={color}
              onClick={() => handleColorChange(shirt.id, color)}
              className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer ${
                selected.color === color ? "outline-4 outline-black outline-offset-0" : ""
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            >
              {/* Badge */}
              {getQuantityForColor(color) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getQuantityForColor(color)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mt-2">
        <label className="text-sm sm:text-base font-medium">Size:</label>
        <div className="flex gap-2 mt-2">
          {shirt.sizes.map((size) => (
            <div key={size} className="relative">
              <button
                onClick={() => handleSizeChange(shirt.id, size)}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border rounded-full cursor-pointer ${
                  selected.size === size ? "border-4 border-black" : ""
                }`}
              >
                {size}
              </button>
              {/* Badge */}
              {getQuantityForSize(size) > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getQuantityForSize(size)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add to Cart or Update Quantity */}
      {quantity === 0 ? (
        <button
          onClick={() => addToCart(shirt, selected.color, selected.size)}
          className="cursor-pointer mt-4 px-4 py-2 bg-black text-white rounded w-full text-sm sm:text-base"
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center justify-between mt-4 border rounded px-2 py-1">
          <button
            onClick={() =>
              updateQuantity(
                shirt.id,
                selected.color,
                selected.size,
                quantity - 1
              )
            }
            className="cursor-pointer px-2 py-1 text-lg sm:text-xl font-bold"
          >
            -
          </button>
          <span className="font-medium">{quantity}</span>
          <button
            onClick={() =>
              updateQuantity(
                shirt.id,
                selected.color,
                selected.size,
                quantity + 1
              )
            }
            className="cursor-pointer px-2 py-1 text-lg sm:text-xl font-bold"
          >
            +
          </button>
        </div>
      )}
    </div>
    </div>
  );
}
