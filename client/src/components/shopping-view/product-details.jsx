/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import { StarIcon, Ruler, ShoppingBag, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { addToCart } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";

const sizeChartData = {
  kids: {
    21: { cm: 13.3, inches: 5.2, age: "12-15 Month" },
    22: { cm: 13.8, inches: 5.43, age: "15-18 Month" },
    23: { cm: 14.2, inches: 5.6, age: "18-24 Month" },
    24: { cm: 14.7, inches: 5.8, age: "2-2.5 year" },
    25: { cm: 15.2, inches: 6, age: "2.5-3 year" },
    26: { cm: 16, inches: 6.3, age: "3-3.5 year" },
    27: { cm: 16.8, inches: 6.6, age: "3.5-4 year" },
    28: { cm: 17.3, inches: 6.8, age: "4-4.5 year" },
    29: { cm: 17.8, inches: 7, age: "4.5-5 year" },
    30: { cm: 18.3, inches: 7.2, age: "5-5.5 year" },
    31: { cm: 19.8, inches: 7.8, age: "5.5-6 year" },
    32: { cm: 20.5, inches: 8, age: "6-7 year" },
    33: { cm: 21.2, inches: 8.35, age: "7-8 year" },
    34: { cm: 22, inches: 8.66, age: "8-9 year" },
    35: { cm: 22.5, inches: 8.85, age: "9-10 year" },
    36: { cm: 23.2, inches: 9.1, age: "10-11 year" },
    37: { cm: 23.9, inches: 9.4, age: "11-12 Year" },
  },
  adult: {
    35: {
      cm: 22.5,
      inches: 8.85,
      eu: "35",
      uk: "2.5",
      us_men: "3.5",
      us_women: "5",
    },
    36: {
      cm: 23.2,
      inches: 9.1,
      eu: "36",
      uk: "3.5",
      us_men: "4.5",
      us_women: "6",
    },
    37: {
      cm: 23.9,
      inches: 9.4,
      eu: "37",
      uk: "4.5",
      us_men: "5.5",
      us_women: "7",
    },
    38: {
      cm: 24.6,
      inches: 9.7,
      eu: "38",
      uk: "5.5",
      us_men: "6.5",
      us_women: "8",
    },
    39: {
      cm: 25.3,
      inches: 10,
      eu: "39",
      uk: "6.5",
      us_men: "7.5",
      us_women: "9",
    },
    40: {
      cm: 26,
      inches: 10.2,
      eu: "40",
      uk: "7.5",
      us_men: "8.5",
      us_women: "10",
    },
    41: {
      cm: 26.7,
      inches: 10.5,
      eu: "41",
      uk: "8.5",
      us_men: "9.5",
      us_women: "11",
    },
    42: {
      cm: 27.4,
      inches: 10.8,
      eu: "42",
      uk: "9.5",
      us_men: "10.5",
      us_women: "12",
    },
    43: {
      cm: 28.1,
      inches: 11.1,
      eu: "43",
      uk: "10.5",
      us_men: "11.5",
      us_women: "13",
    },
    44: {
      cm: 28.8,
      inches: 11.3,
      eu: "44",
      uk: "11.5",
      us_men: "12.5",
      us_women: "14",
    },
    45: {
      cm: 29.5,
      inches: 11.6,
      eu: "45",
      uk: "12.5",
      us_men: "13.5",
      us_women: "15",
    },
  },
};

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [sizeChartType, setSizeChartType] = useState("kids");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  useEffect(() => {
    if (productDetails?.variants?.length > 0) {
      setSelectedVariant(productDetails.variants[0]);
      setSelectedSize(null);
      setQuantity(1);
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  const handleClose = () => {
    setOpen(false);
    setSelectedSize(null);
    setReviewMsg("");
    setRating(0);
    setShowSizeChart(false);
    setQuantity(1);
    dispatch(setProductDetails(null));
  };

  const handleAddToCart = async () => {
    try {
      if (!selectedVariant) {
        toast({ title: "Please select a color", variant: "destructive" });
        return;
      }
      if (!selectedSize) {
        toast({ title: "Please select a size", variant: "destructive" });
        return;
      }
      const sizeData = selectedVariant.sizes.find(
        (s) => s.size === selectedSize
      );
      if (!sizeData || sizeData.quantity === 0) {
        toast({ title: "Size not available", variant: "destructive" });
        return;
      }
      if (quantity > sizeData.quantity) {
        toast({
          title: `Only ${sizeData.quantity} items available`,
          variant: "destructive",
        });
        return;
      }
      setIsLoading(true);
      setError(null);

      const result = await dispatch(
        addToCart({
          productId: productDetails._id,
          variantId: selectedVariant._id,
          size: selectedSize,
          quantity,
          color: selectedVariant.color,
          price: sizeData.salePrice || sizeData.price,
          image: selectedVariant.image,
          name: productDetails.name,
        })
      );

      if (result.payload) {
        toast({ title: "Added to cart successfully" });
        handleClose();
      }
    } catch (err) {
      setError(err.message || "Failed to add to cart");
      toast({
        title: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReview = async () => {
    if (!rating || !reviewMsg.trim()) return;
    try {
      setIsLoading(true);
      const res = await dispatch(
        addReview({
          productId: productDetails._id,
          userId: user?.id,
          userName: user?.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        })
      );
      if (res.payload.success) {
        setReviewMsg("");
        setRating(0);
        dispatch(getReviews(productDetails._id));
        toast({ title: "Review added successfully" });
      }
    } catch {
      toast({ title: "Failed to add review", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const averageRating = reviews?.length
    ? (
        reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      ).toFixed(1)
    : 0;

  const renderSizeChart = () => {
    const entries =
      sizeChartType === "kids"
        ? Object.entries(sizeChartData.kids)
        : Object.entries(sizeChartData.adult);
    return (
      <div className="mb-6 bg-neutral-50 rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Euro Size</TableHead>
              <TableHead>CM</TableHead>
              <TableHead>Inches</TableHead>
              {sizeChartType === "kids" ? (
                <TableHead>Age</TableHead>
              ) : (
                <>
                  <TableHead>UK</TableHead>
                  <TableHead>US Men</TableHead>
                  <TableHead>US Women</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(([sz, dt]) => (
              <TableRow key={sz}>
                <TableCell>{dt.eu || sz}</TableCell>
                <TableCell>{dt.cm}</TableCell>
                <TableCell>{dt.inches}</TableCell>
                {sizeChartType === "kids" ? (
                  <TableCell>{dt.age}</TableCell>
                ) : (
                  <>
                    <TableCell>{dt.uk}</TableCell>
                    <TableCell>{dt.us_men}</TableCell>
                    <TableCell>{dt.us_women}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] p-0">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative group p-4">
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
              <img
                src={selectedVariant?.image}
                alt={productDetails?.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex gap-2 mb-4">
              {productDetails?.variants?.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setSelectedSize(null);
                    setQuantity(1);
                  }}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedVariant?.color === variant.color
                      ? "border-rose-300 scale-110"
                      : "border-transparent hover:border-rose-200"
                  }`}
                >
                  <span
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: variant.color }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 max-h-[80vh] overflow-y-auto">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-neutral-800">
                  {productDetails?.name}
                </h1>
              </div>
              <p className="text-neutral-600 mb-4">
                {productDetails?.description}
              </p>
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

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-neutral-700">
                    Select Size
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-rose-300 hover:text-rose-400"
                      onClick={() => setSizeChartType("kids")}
                    >
                      Kids Sizes
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-rose-300 hover:text-rose-400"
                      onClick={() => setSizeChartType("adult")}
                    >
                      Adult Sizes
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-rose-300 hover:text-rose-400 flex items-center gap-1"
                      onClick={() => setShowSizeChart(!showSizeChart)}
                    >
                      <Ruler className="w-4 h-4" />
                      Size Guide
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedVariant?.sizes?.map((sizeOption) => (
                    <Button
                      key={sizeOption.size}
                      variant={
                        selectedSize === sizeOption.size ? "default" : "outline"
                      }
                      className={`px-6 ${
                        selectedSize === sizeOption.size
                          ? "bg-rose-200 text-neutral-700 hover:bg-rose-300"
                          : sizeOption.quantity > 0
                          ? "text-neutral-600 hover:text-neutral-700"
                          : "text-neutral-400 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        sizeOption.quantity > 0 &&
                        setSelectedSize(sizeOption.size)
                      }
                      disabled={sizeOption.quantity === 0}
                    >
                      {sizeOption.size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                {selectedSize && (
                  <>
                    {selectedVariant?.sizes.find((s) => s.size === selectedSize)
                      ?.salePrice && (
                      <span className="text-2xl text-neutral-400 line-through">
                        ৳
                        {
                          selectedVariant?.sizes.find(
                            (s) => s.size === selectedSize
                          ).price
                        }
                      </span>
                    )}
                    <span className="text-3xl font-bold text-rose-300">
                      ৳{" "}
                      {selectedVariant?.sizes.find(
                        (s) => s.size === selectedSize
                      )?.salePrice ||
                        selectedVariant?.sizes.find(
                          (s) => s.size === selectedSize
                        )?.price}
                    </span>
                  </>
                )}
              </div>

              {showSizeChart && renderSizeChart()}

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
                    disabled={!selectedSize}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const maxQty =
                        selectedVariant?.sizes.find(
                          (s) => s.size === selectedSize
                        )?.quantity || 0;
                      setQuantity(Math.min(quantity + 1, maxQty));
                    }}
                    className="text-neutral-600"
                    disabled={
                      !selectedSize ||
                      quantity >=
                        (selectedVariant?.sizes.find(
                          (s) => s.size === selectedSize
                        )?.quantity || 0)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}

              <Button
                className="w-full bg-rose-200 hover:bg-rose-300 text-neutral-700 mb-8"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedVariant || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>

              <Separator className="mb-8" />

              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-800">
                  Customer Reviews
                </h2>
                <div className="space-y-4 mb-6">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((rv, i) => (
                      <div key={i} className="bg-neutral-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-rose-100 text-neutral-700">
                              {rv.userName[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-neutral-800">
                                {rv.userName}
                              </span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((st) => (
                                  <StarIcon
                                    key={st}
                                    className={`w-4 h-4 ${
                                      st <= rv.reviewValue
                                        ? "text-yellow-400 fill-current"
                                        : "text-neutral-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-neutral-600">
                              {rv.reviewMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-500 italic">No reviews yet</p>
                  )}
                </div>
                {user && (
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
                    <Label className="text-neutral-700">Write a Review</Label>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <StarIcon
                          key={st}
                          className={`w-6 h-6 cursor-pointer ${
                            st <= rating
                              ? "text-yellow-400 fill-current"
                              : "text-neutral-300 hover:text-yellow-200"
                          }`}
                          onClick={() => setRating(st)}
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
                      disabled={!rating || !reviewMsg.trim() || isLoading}
                      className="w-full bg-rose-200 hover:bg-rose-300 text-neutral-700"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      {isLoading ? "Submitting..." : "Submit Review"}
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
