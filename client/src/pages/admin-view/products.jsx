import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, PlusCircle } from "lucide-react";
import AdminProductTile from "@/components/admin-view/product-tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { deleteProduct, fetchAllProducts } from "@/store/admin/products-slice";
import ProductImageUpload from "@/components/admin-view/ProductImage";
import { manageProduct } from "@/store/shop/products-slice";

const CATEGORIES = ["Boys", "Girls", "Footwears", "Home & Kitchen"];

const initialInventoryData = {
  size: "",
  quantity: "",
  inStock: true,
};

const initialFormData = {
  name: "",
  description: "",
  category: "",
  brand: "",
  images: [],
  inventory: [],
  price: {},
  sale_price: {},
  tags: [],
  isFeatured: false, // New field
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentInventoryData, setCurrentInventoryData] =
    useState(initialInventoryData);
  const [imageFiles, setImageFiles] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [currentPriceData, setCurrentPriceData] = useState({
    size: "",
    price: "",
    salePrice: "",
  });
  const [tagInput, setTagInput] = useState("");

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

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
        variant: "destructive",
      });
    }
  };

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
  };

  function onSubmit(event) {
    event.preventDefault();

    const isValid =
      formData.name &&
      formData.description &&
      formData.category &&
      formData.inventory.length > 0;

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add inventory",
        variant: "destructive",
      });
      return;
    }

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
      isFeatured: formData.isFeatured, // Include featured status
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
      <div className="container mx-auto px-4 py-6">
        <div className="mb-5 flex justify-end">
          <Button
            onClick={() => setOpenCreateProductsDialog(true)}
            className="w-full sm:w-auto"
          >
            Add New Product
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Sheet open={openCreateProductsDialog} onOpenChange={resetForm}>
          <SheetContent
            side="right"
            className="w-full sm:w-[540px] overflow-y-auto"
          >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Featured Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: checked,
                    }))
                  }
                />
                <Label
                  htmlFor="featured"
                  className="text-sm font-medium leading-none"
                >
                  Mark as Featured Product
                </Label>
              </div>

              <div className="border p-2 rounded-md">
                <h3 className="text-lg font-semibold mb-4">
                  Product Inventory
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <Input
                    placeholder="Size"
                    value={currentInventoryData.size}
                    onChange={(e) =>
                      setCurrentInventoryData((prev) => ({
                        ...prev,
                        size: e.target.value,
                      }))
                    }
                  />
                  <Input
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
                        price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Sale Price"
                    type="number"
                    value={currentPriceData.salePrice}
                    onChange={(e) =>
                      setCurrentPriceData((prev) => ({
                        ...prev,
                        size: currentInventoryData.size,
                        salePrice: e.target.value || prev.price,
                      }))
                    }
                  />
                  <Button
                    variant="outline"
                    className="col-span-2 sm:col-span-4 mt-2"
                    onClick={handleAddInventory}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Inventory
                  </Button>
                </div>

                {formData?.inventory.map((inv, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border p-2 rounded mb-2"
                  >
                    <div>
                      Size: {inv.size} - Qty: {inv.quantity} - Price: ৳
                      {formData.price[inv.size]}
                      {formData.sale_price[inv.size] !==
                        formData.price[inv.size] &&
                        ` - Sale: ৳${formData.sale_price[inv.size]}`}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInventory(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

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
                  !imageFiles
                }
                className="w-full"
              >
                {currentEditedId !== null ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Fragment>
  );
}

export default AdminProducts;
