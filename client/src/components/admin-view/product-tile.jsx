/* eslint-disable react/prop-types */
import { Star, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete
}) {
  // Get price range
  const getPriceRange = () => {
    const prices = product.variants.flatMap(v => 
      v.sizes.map(s => s.salePrice || s.price)
    );
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };

  const { min, max } = getPriceRange();

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden group">
      <div className="relative">
        {/* Main Image */}
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.variants[0]?.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500">
              Featured
            </Badge>
          )}
        </div>

        {/* Color Variants */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {product.variants.map((variant, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: variant.color }}
              title={variant.color}
            />
          ))}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg leading-tight mb-1">
              {product.name}
            </h2>
            <div className="text-sm text-muted-foreground">
              {product.brand && (
                <span className="mr-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  {product.brand}
                </span>
              )}
              <span>{product.category}</span>
              {product.subcategory && ` / ${product.subcategory}`}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{product.averageReview || "No reviews"}</span>
          </div>
          <span className="text-sm">
            Stock: {product.totalStock}
          </span>
        </div>

        <div className="text-lg font-semibold">
          ৳{min}
          {min !== max && ` - ৳${max}`}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button 
          className="flex-1" 
          variant="destructive"
          onClick={() => handleDelete(product._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;