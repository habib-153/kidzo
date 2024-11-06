/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StarIcon, Ruler, Heart } from "lucide-react";

const sizeChartData = {
  "24": { chest: "36-38", waist: "28-30", hip: "38-40" },
  "30": { chest: "40-42", waist: "32-34", hip: "42-44" }
};

const ProductDetailsDialog = ({ open, setOpen, productDetails, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (selectedSize && onAddToCart) {
      onAddToCart(productDetails?._id, selectedSize);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      setOpen(false);
      setSelectedSize(null);
      setShowSizeChart(false);
    
    }}>
      <DialogContent className="max-w-[90vw] overflow-y-scroll sm:max-w-[80vw] lg:max-w-[70vw] p-0">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative group">
            <div className="aspect-square overflow-hidden rounded-l-lg relative">
              <img
                src={productDetails?.images[currentImageIndex]}
                alt={productDetails?.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button
                variant="ghost"
                className="absolute top-4 right-4 rounded-full p-2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add wishlist functionality
                }}
              >
                <Heart className="w-5 h-5 text-pink-600" />
              </Button>
            </div>
            {productDetails?.images.length > 1 && (
              <div className="flex gap-2 mt-4 px-4">
                {productDetails.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-pink-600' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {productDetails?.name}
                </h1>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {productDetails?.description}
              </p>
              
              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Select Size</Label>
                  <Button
                    variant="ghost"
                    className="text-pink-600 flex items-center gap-1"
                    onClick={() => setShowSizeChart(!showSizeChart)}
                  >
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(productDetails?.price || {}).map(([size, price]) => {
                    const isInStock = productDetails?.inventory.some(
                      item => item.size === size && item.inStock
                    );
                    return (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className={`px-6 ${
                          selectedSize === size ? 'bg-pink-600 text-white' : 'text-gray-600'
                        } ${!isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => isInStock && handleSizeSelect(size)}
                        disabled={!isInStock}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Size Chart */}
              {showSizeChart && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">Chest (in)</TableHead>
                        <TableHead className="text-center">Waist (in)</TableHead>
                        <TableHead className="text-center">Hip (in)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(sizeChartData).map(([size, measurements]) => (
                        <TableRow key={size}>
                          <TableCell className="text-center font-medium">{size}</TableCell>
                          <TableCell className="text-center">{measurements.chest}</TableCell>
                          <TableCell className="text-center">{measurements.waist}</TableCell>
                          <TableCell className="text-center">{measurements.hip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Price Display */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Price</Label>
                <div className="flex items-baseline gap-3">
                  {selectedSize && productDetails?.sale_price?.[selectedSize] < productDetails?.price?.[selectedSize] && (
                    <span className="text-2xl text-gray-400 line-through">
                      ${productDetails?.price?.[selectedSize]}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-pink-600">
                    {selectedSize 
                      ? `$${productDetails?.sale_price?.[selectedSize] || productDetails?.price?.[selectedSize]}`
                      : 'Select size to see price'}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="grid gap-4">
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white h-12 text-lg"
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-pink-600 text-pink-600 hover:bg-pink-50 h-12 text-lg"
                >
                  Add to Wishlist
                </Button>
              </div>

              <Separator className="my-8" />

              {/* Reviews Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
                
                {/* Review Form */}
                <div className="space-y-4">
                  <Label>Write a Review</Label>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 cursor-pointer ${
                          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Input
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="mb-2"
                  />
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    disabled={!rating || !reviewMsg.trim()}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;