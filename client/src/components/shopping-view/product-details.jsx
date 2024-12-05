/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarIcon, Ruler, ShoppingBag, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { addToCart } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";

const sizeChartData = {
  24: { chest: "36-38", waist: "28-30", hip: "38-40" },
  30: { chest: "40-42", waist: "32-34", hip: "42-44" },
};

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [productDetails, dispatch]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    const inventory = productDetails.inventory.find(
      (item) => item.size === selectedSize
    );
    if (!inventory || !inventory.inStock) {
      toast({
        title: "Size not available",
        variant: "destructive",
      });
      return;
    }

    if (quantity > inventory.quantity) {
      toast({
        title: `Only ${inventory.quantity} items available`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        productId: productDetails._id,
        product: productDetails,
        quantity: quantity,
        size: selectedSize,
      })
    );
    //dispatch(fetchCartItems());
    toast({
      title: "Added to cart successfully",
    });
  };

  const handleAddReview = () => {
    if (!rating || !reviewMsg.trim()) return;

    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id));
        toast({
          title: "Review added successfully",
        });
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSize(null);
    setReviewMsg("");
    setRating(0);
    setShowSizeChart(false);
    setQuantity(1);
    dispatch(setProductDetails(null));
  };

  const averageRating = reviews?.length
    ? (
        reviews.reduce((sum, review) => sum + review.reviewValue, 0) /
        reviews.length
      ).toFixed(1)
    : 0;

  const inventory = selectedSize
    ? productDetails.inventory.find((item) => item.size === selectedSize)
    : null;
  const maxQuantity = inventory ? inventory.quantity : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] p-0">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative group p-4">
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
              <img
                src={productDetails?.images[selectedImage]}
                alt={productDetails?.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productDetails?.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-rose-200"
                      : "border-transparent hover:border-rose-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productDetails?.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-8 max-h-[80vh] overflow-y-auto">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-neutral-800">
                  {productDetails?.name}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-300 hover:text-rose-400"
                >
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-neutral-600 mb-4">
                {productDetails?.description}
              </p>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-4 h-4 ${
                        star <= averageRating
                          ? "text-yellow-400 fill-current"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  ({reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-6">
                {selectedSize &&
                  productDetails?.sale_price?.[selectedSize] <
                    productDetails?.price?.[selectedSize] && (
                    <span className="text-2xl text-neutral-400 line-through">
                      ৳{productDetails?.sale_price?.[selectedSize]}
                    </span>
                  )}
                <span className="text-3xl font-bold text-rose-300">
                  ৳
                  {selectedSize
                    ? productDetails?.sale_price?.[selectedSize] ||
                      productDetails?.price?.[selectedSize]
                    : "Select size"}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-neutral-700">
                    Select Size
                  </Label>
                  <Button
                    variant="ghost"
                    className="text-rose-300 hover:text-rose-400 flex items-center gap-1"
                    onClick={() => setShowSizeChart(!showSizeChart)}
                  >
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(productDetails?.price || {}).map((size) => {
                    const inventory = productDetails.inventory.find(
                      (item) => item.size === size
                    );
                    const isAvailable = inventory && inventory.inStock;

                    return (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className={`px-6 ${
                          selectedSize === size
                            ? "bg-rose-200 text-neutral-700 hover:bg-rose-300"
                            : isAvailable
                            ? "text-neutral-600 hover:text-neutral-700"
                            : "text-neutral-400 cursor-not-allowed"
                        }`}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Size Chart */}
              {showSizeChart && (
                <div className="mb-6 bg-neutral-50 rounded-lg p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-neutral-700">Size</TableHead>
                        <TableHead className="text-neutral-700">
                          Chest (in)
                        </TableHead>
                        <TableHead className="text-neutral-700">
                          Waist (in)
                        </TableHead>
                        <TableHead className="text-neutral-700">
                          Hip (in)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(sizeChartData).map(
                        ([size, measurements]) => (
                          <TableRow key={size}>
                            <TableCell className="font-medium">
                              {size}
                            </TableCell>
                            <TableCell>{measurements.chest}</TableCell>
                            <TableCell>{measurements.waist}</TableCell>
                            <TableCell>{measurements.hip}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-600"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(quantity + 1, maxQuantity))
                    }
                    className="text-neutral-600"
                    disabled={quantity >= maxQuantity}
                  >
                    +
                  </Button>
                </div>
                {selectedSize && quantity >= maxQuantity && (
                  <p className="text-sm text-red-500 mt-1">
                    Maximum quantity reached
                  </p>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full bg-rose-200 hover:bg-rose-300 text-neutral-700 mb-8"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>

              <Separator className="mb-8" />

              {/* Reviews Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-800">
                  Customer Reviews
                </h2>

                {/* Existing Reviews */}
                <div className="space-y-4 mb-6">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className="bg-neutral-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-rose-100 text-neutral-700">
                              {review.userName[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-neutral-800">
                                {review.userName}
                              </span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.reviewValue
                                        ? "text-yellow-400 fill-current"
                                        : "text-neutral-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-neutral-600">
                              {review.reviewMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-500 italic">No reviews yet</p>
                  )}
                </div>

                {/* Review Form */}
                {user && (
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
                    <Label className="text-neutral-700">Write a Review</Label>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-6 h-6 cursor-pointer ${
                            star <= rating
                              ? "text-yellow-400 fill-current"
                              : "text-neutral-300 hover:text-yellow-200"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    <Input
                      value={reviewMsg}
                      onChange={(e) => setReviewMsg(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="bg-white"
                    />
                    <Button
                      onClick={handleAddReview}
                      disabled={!rating || !reviewMsg.trim()}
                      className="w-full bg-rose-200 hover:bg-rose-300 text-neutral-700"
                    >
                      Submit Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
