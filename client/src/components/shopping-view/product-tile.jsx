/* eslint-disable react/prop-types */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ShoppingBag } from "lucide-react";

const ShoppingProductTile = ({ product, handleGetProductDetails, handleAddtoCart }) => {
  const basePrice = product?.price?.[Object.keys(product.price)[0]] || 0;
  const salePrice = product?.sale_price?.[Object.keys(product.sale_price)[0]] || 0;
  const hasDiscount = salePrice < basePrice;

  const getInventoryStatus = () => {
    if (product?.inventory.every(item => !item.inStock)) {
      return { type: 'outOfStock', text: 'Out Of Stock', color: 'bg-red-500/90 hover:bg-red-600' };
    }
    if (product?.inventory.some(item => item.quantity < 10)) {
      return { type: 'lowStock', text: 'Low Stock', color: 'bg-amber-500/90 hover:bg-amber-600' };
    }
    if (hasDiscount) {
      return { type: 'sale', text: 'Sale', color: 'bg-pink-500/90 hover:bg-pink-600' };
    }
    return null;
  };

  const inventoryStatus = getInventoryStatus();

  return (
    <Card className="group w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
      <div 
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <img
            src={product?.images[0]}
            alt={product?.name}
            className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {inventoryStatus && (
            <Badge className={`absolute top-3 left-3 ${inventoryStatus.color}`}>
              {inventoryStatus.text}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-pink-600 transition-colors">
            {product?.name}
          </h2>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">
              {product?.category}
            </span>
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">4.5</span>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(product?.price || {}).map(([size, price]) => (
              <div key={size} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Size {size}</span>
                <div className="flex items-baseline gap-2">
                  {product?.sale_price?.[size] < price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${price}
                    </span>
                  )}
                  <span className="text-lg font-bold text-pink-600">
                    ${product?.sale_price?.[size] || price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 bg-gray-50">
        <Button
          onClick={() => handleAddtoCart(product?._id)}
          disabled={product?.inventory.every(item => !item.inStock)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 disabled:opacity-50"
        >
          <ShoppingBag className="w-4 h-4" />
          {product?.inventory.every(item => !item.inStock) ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;