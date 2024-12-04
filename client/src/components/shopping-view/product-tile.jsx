/* eslint-disable react/prop-types */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ShoppingProductTile = ({ product, handleGetProductDetails }) => {
  // const { cartItems } = useSelector((state) => state.shopCart);
  //console.log(cartItems);
  const salePrice = Object.entries(product?.sale_price || {});
  const hasDiscount = salePrice.some(
    ([size, price]) => price < (product?.price[size] || 0)
  );
  const isOutOfStock = product?.inventory.every((item) => !item.inStock);
  const hasLowStock = product?.inventory.some((item) => item.quantity < 10);

  return (
    <Card className="group w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg bg-white/95">
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
          {isOutOfStock ? (
            <Badge className="absolute top-3 left-3 bg-neutral-500/90 hover:bg-neutral-600">
              Out Of Stock
            </Badge>
          ) : hasLowStock ? (
            <Badge className="absolute top-3 left-3 bg-amber-400/90 hover:bg-amber-500">
              Low Stock
            </Badge>
          ) : hasDiscount ? (
            <Badge className="absolute top-3 left-3 bg-rose-200/90 hover:bg-rose-300">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2 text-neutral-800 group-hover:text-rose-300 transition-colors">
            {product?.name}
          </h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-neutral-600">
              {product?.category}
            </span>
            <span className="text-sm text-neutral-600">{product?.brand}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-neutral-600">
              {product?.description}
            </span>
          </div>
          {/* <div className="flex flex-col gap-1">
            {basePrice.map(([size, price]) => (
              <div key={size} className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Size {size}</span>
                <div className="flex items-baseline gap-2">
                  {product?.sale_price[size] < price && (
                    <span className="text-sm text-neutral-400 line-through">
                      ${price}
                    </span>
                  )}
                  <span className="text-lg font-semibold text-rose-300">
                    ${product?.sale_price[size] || price}
                  </span>
                </div>
              </div>
            ))}
          </div> */}
        </CardContent>
      </div>
      <CardFooter className="p-4 bg-neutral-50">
        <Button
          onClick={() => handleGetProductDetails(product?._id)}
          className="w-full bg-rose-200 hover:bg-rose-300 text-neutral-700 flex items-center gap-2 transition-colors"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
