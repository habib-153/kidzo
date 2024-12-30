import { Button } from "@/components/ui/button";
import {
  // Airplay,
  // BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FootprintsIcon,
  ShirtIcon,
  // CloudLightning,
  // Heater,
  // Images,
  // Shirt,
  // ShirtIcon,
  // ShoppingBasket,
  // WashingMachine,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  fetchTopSellingProducts,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Link, useNavigate } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import Footer from "@/components/shopping-view/footer";

const categoriesWithIcon = [
  // { id: "Boys", label: "Boys", icon: ShirtIcon },
  // { id: "Girls", label: "Girls", icon: CloudLightning },
  { id: "clothing", label: "Clothing", icon: ShirtIcon },
  { id: "Shoes", label: "Shoes", icon: FootprintsIcon },
];

// const brandsWithIcon = [
//   { id: "nike", label: "Nike", icon: Shirt },
//   { id: "adidas", label: "Adidas", icon: WashingMachine },
//   { id: "puma", label: "Puma", icon: ShoppingBasket },
//   { id: "levi", label: "Levi's", icon: Airplay },
//   { id: "zara", label: "Zara", icon: Images },
//   { id: "h&m", label: "H&M", icon: Heater },
// ];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails, topSellingProducts } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filter featured products
  const featuredProducts = productList
    ? productList.filter((product) => product.featured)
    : [];

  // Filter top product
  const topProducts =
    topSellingProducts?.map((item) => ({
      ...item.product,
      totalQuantitySold: item.totalQuantitySold,
      totalRevenue: item.totalRevenue,
    })) || [];

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(
      fetchTopSellingProducts({
        filterParams: {},
        sortParams: "quantity-hightolow",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(
    featuredProducts,
    topSellingProducts,
    productList,
    productDetails
  );
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid text-center mx-auto grid-cols-1 md:grid-cols-2 gap-4">
            {categoriesWithIcon.map((categoryItem, i) => (
              <Card
                key={i}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="md:w-12 md:h-12 w-5 h-5 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem, i) => (
              <Card
                key={i}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts?.map(
                (productItem, idx) =>
                  productItem && (
                    <ShoppingProductTile
                      key={idx}
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                    />
                  )
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No featured products available
            </p>
          )}
        </div>
        <div className="container mx-auto px-4 py-4 md:py-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Top Selling Products
          </h2>
          {topProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topProducts?.map(
                (productItem, idx) =>
                  productItem && (
                    <ShoppingProductTile
                      key={idx}
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                    />
                  )
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No top products available
            </p>
          )}
        </div>
        <div className="text-center mx-auto mt-4">
          <Link to={"/shop/listing"}>
            <Button>See All the Products</Button>
          </Link>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <Footer />
    </div>
  );
}

export default ShoppingHome;
