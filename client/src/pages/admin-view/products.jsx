import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, PlusCircle } from "lucide-react";
import AdminProductTile from "@/components/admin-view/product-tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
=======
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
<<<<<<< HEAD
import { deleteProduct, fetchAllProducts } from "@/store/admin/products-slice";
import ProductImageUpload from "@/components/admin-view/ProductImage";
import { manageProduct } from "@/store/shop/products-slice";

const CATEGORIES = ["Boys", "Girls", "Footwears", "Home & Kitchen"];

const initialInventoryData = {
  size: "",
  quantity: "",
  inStock: true,
=======
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, PlusCircle } from "lucide-react";

const initialSizeData = {
  size: "",
  price: "",
  salePrice: "",
  totalStock: "",
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
};

const initialFormData = {
  name: "",
  description: "",
  category: "",
  brand: "",
<<<<<<< HEAD
  images: [],
  inventory: [],
  price: {},
  sale_price: {},
  tags: [],
=======
  sizes: [],
  averageReview: 0,
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentInventoryData, setCurrentInventoryData] =
    useState(initialInventoryData);
  const [imageFiles, setImageFiles] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);
<<<<<<< HEAD
  const [currentPriceData, setCurrentPriceData] = useState({
    size: "",
    price: "",
    salePrice: "",
  });
  const [tagInput, setTagInput] = useState("");
=======
  const [currentSizeData, setCurrentSizeData] = useState(initialSizeData);
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

<<<<<<< HEAD
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddInventory = () => {
    if (
      currentInventoryData.size &&
      currentInventoryData.quantity &&
      currentPriceData.price
    ) {
      setFormData((prev) => ({
        ...prev,
        inventory: [...(prev.inventory || []), { ...currentInventoryData }],
        price: {
          ...prev.price,
          [currentPriceData.size]: Number(currentPriceData.price),
        },
        sale_price: {
          ...prev.sale_price,
          [currentPriceData.size]: Number(
            currentPriceData.salePrice || currentPriceData.price
          ),
        },
      }));

      setCurrentInventoryData(initialInventoryData);
      setCurrentPriceData({ size: "", price: "", salePrice: "" });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all inventory details",
=======
  // Add size handler
  const handleAddSize = () => {
    // Validate size data before adding
    if (
      currentSizeData.size &&
      currentSizeData.price &&
      currentSizeData.totalStock
    ) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), { ...currentSizeData }],
      }));
      // Reset current size data
      setCurrentSizeData(initialSizeData);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all size details",
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
        variant: "destructive",
      });
    }
  };

<<<<<<< HEAD
  const handleRemoveInventory = (indexToRemove) => {
    setFormData((prev) => {
      const updatedInventory = prev.inventory.filter(
        (_, index) => index !== indexToRemove
      );
      const updatedPrice = { ...prev.price };
      const updatedSalePrice = { ...prev.sale_price };

      const removedSize = prev.inventory[indexToRemove].size;
      delete updatedPrice[removedSize];
      delete updatedSalePrice[removedSize];

      return {
        ...prev,
        inventory: updatedInventory,
        price: updatedPrice,
        sale_price: updatedSalePrice,
      };
    });
=======
  // Remove size handler
  const handleRemoveSize = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle brand input
  const handleBrandChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      brand: e.target.value,
    }));
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
  };

  function onSubmit(event) {
    event.preventDefault();

<<<<<<< HEAD
    const isValid =
      formData.name &&
      formData.description &&
      formData.category &&
      formData.inventory.length > 0;
    // &&
    // imageFiles.length > 0;
=======
    // Validate form data
    const isValid =
      formData.title &&
      formData.description &&
      formData.category &&
      formData.sizes.length > 0 &&
      uploadedImageUrl;
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)

    if (!isValid) {
      toast({
        title: "Validation Error",
<<<<<<< HEAD
        description: "Please fill in all required fields and add inventory",
=======
        description:
          "Please fill in all required fields and add at least one size",
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
        variant: "destructive",
      });
      return;
    }

<<<<<<< HEAD
    const submitFormData = new FormData();
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      brand: formData.brand || "",
      inventory: formData.inventory,
      price: formData.price,
      sale_price: formData.sale_price,
      tags: formData.tags.length ? formData.tags : ["product"],
      images: formData.images,
    };

    submitFormData.append("data", JSON.stringify(productData));
    imageFiles.forEach((file) => {
      submitFormData.append("Images", file);
    });

    dispatch(
      manageProduct({
        id: currentEditedId,
        formData: submitFormData,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        resetForm();
        toast({
          title: `Product ${
            currentEditedId ? "updated" : "added"
          } successfully`,
=======
    const submitData = {
      ...formData,
      image: uploadedImageUrl,
    };

    currentEditedId !== null
      ? dispatch(
          addNewProduct({
            id: currentEditedId,
            formData: submitData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast({ title: "Product updated successfully" });
          }
        })
      : dispatch(addNewProduct(submitData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({ title: "Product added successfully" });
          }
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
        });
      }
    });
  }

  function resetForm() {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFiles(null);
    setCurrentInventoryData(initialInventoryData);
    setCurrentPriceData({ size: "", price: "", salePrice: "" });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted successfully" });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                setImageFiles={setImageFiles}
              />
            ))
          : null}
      </div>
<<<<<<< HEAD
      <Sheet open={openCreateProductsDialog} onOpenChange={resetForm}>
=======
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setCurrentSizeData(initialSizeData);
        }}
      >
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            isEditMode={currentEditedId !== null}
            initialImages={currentEditedId ? formData.images : []}
            setFormData={setFormData}
          />
          <div className="py-6 space-y-4">
<<<<<<< HEAD
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full"
              required
            />

            <Input
              placeholder="Brand (Optional)"
              value={formData.brand}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, brand: e.target.value }))
              }
            />

            <div className="border p-2 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Product Inventory</h3>

              <div className="grid grid-cols-4 gap-1 mb-4">
                <Input
                  placeholder="Size"
                  value={currentInventoryData.size}
                  onChange={(e) =>
                    setCurrentInventoryData((prev) => ({
=======
            {/* Existing form elements */}
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements.filter(
                (control) =>
                  control.name !== "brand" &&
                  control.name !== "price" &&
                  control.name !== "salePrice" &&
                  control.name !== "totalStock"
              )}
            />

            {/* Brand Input */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Brand (Optional)"
                value={formData.brand}
                onChange={handleBrandChange}
              />
            </div>

            {/* Size and Price Management */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Product Sizes</h3>

              {/* Size Input Fields */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Input
                  placeholder="Size"
                  value={currentSizeData.size}
                  onChange={(e) =>
                    setCurrentSizeData((prev) => ({
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
                      ...prev,
                      size: e.target.value,
                    }))
                  }
                />
                <Input
<<<<<<< HEAD
                  placeholder="Quantity"
                  type="number"
                  value={currentInventoryData.quantity}
                  onChange={(e) =>
                    setCurrentInventoryData((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                      inStock: Number(e.target.value) > 0,
                    }))
                  }
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={currentPriceData.price}
                  onChange={(e) =>
                    setCurrentPriceData((prev) => ({
                      ...prev,
                      size: currentInventoryData.size,
=======
                  placeholder="Price"
                  type="number"
                  value={currentSizeData.price}
                  onChange={(e) =>
                    setCurrentSizeData((prev) => ({
                      ...prev,
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
                      price: e.target.value,
                    }))
                  }
                />
                <Input
<<<<<<< HEAD
                  placeholder="Sale Price"
                  type="number"
                  value={currentPriceData.salePrice}
                  onChange={(e) =>
                    setCurrentPriceData((prev) => ({
                      ...prev,
                      size: currentInventoryData.size,
                      salePrice: e.target.value || prev.price, // Default to regular price if empty
=======
                  placeholder="Stock"
                  type="number"
                  value={currentSizeData.totalStock}
                  onChange={(e) =>
                    setCurrentSizeData((prev) => ({
                      ...prev,
                      totalStock: e.target.value,
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
                    }))
                  }
                />
                <Button
                  variant="outline"
<<<<<<< HEAD
                  className="col-span-4 mt-2"
                  onClick={handleAddInventory}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Inventory
                </Button>
              </div>

              {formData?.inventory.map((inv, index) => (
=======
                  className="col-span-3 mt-2"
                  onClick={handleAddSize}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Size
                </Button>
              </div>

              {/* Added Sizes List */}
              {formData?.sizes.map((size, index) => (
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
                <div
                  key={index}
                  className="flex items-center justify-between border p-2 rounded mb-2"
                >
                  <div>
<<<<<<< HEAD
                    Size: {inv.size} - Qty: {inv.quantity} - Price: ৳
                    {formData.price[inv.size]}
                    {formData.sale_price[inv.size] !==
                      formData.price[inv.size] &&
                      ` - Sale: ৳${formData.sale_price[inv.size]}`}
=======
                    {size.size} - ${size.price} (Stock: {size.totalStock})
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
<<<<<<< HEAD
                    onClick={() => handleRemoveInventory(index)}
=======
                    onClick={() => handleRemoveSize(index)}
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Product Tags</h3>
              <Input
                placeholder="Add tags (press Enter to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-gray-200 px-2 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 h-4 w-4 p-0"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onSubmit}
              disabled={
                !formData.name ||
                !formData.description ||
                !formData.category ||
                formData.inventory.length === 0 ||
                !imageFiles // Change from !uploadedImageUrl to !imageFile
              }
              className="w-full"
=======
            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={formData.sizes.length === 0 || !uploadedImageUrl}
>>>>>>> b8be50d (needs to fix the errors on add and edit product form redux)
            >
              {currentEditedId !== null ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
