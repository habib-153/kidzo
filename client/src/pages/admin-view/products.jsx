import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
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
import ImageUpload from "@/components/admin-view/image-upload";
import { manageProduct } from "@/store/shop/products-slice";
import { ChromePicker } from "react-color";
import VariantCard from "@/components/admin-view/VariantCard";
import SizeList from "@/components/admin-view/SizeList";

const CATEGORIES = ["Clothing", "Shoes"];

const SUBCATEGORIES = {
  Clothing: ["Boys", "Girls", "Winter Collection", "Summer Collection"],
  Shoes: ["Boys", "Girls", "Winter Collection", "Summer Collection"],
};

const initialVariantData = {
  color: "",
  image: "",
  sizes: [],
};

const initialSizeData = {
  size: "",
  price: "",
  salePrice: "",
  quantity: 0,
};

const initialFormData = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  brand: "",
  tags: [],
  variants: [],
  featured: false,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentSize, setCurrentSize] = useState(initialSizeData);
  const [currentVariant, setCurrentVariant] = useState(initialVariantData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [currentSubcategories, setCurrentSubcategories] = useState([]);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  console.log(productList);
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])],
      }));
      setTagInput("");
    }
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
    }));
    setCurrentSubcategories(SUBCATEGORIES[value] || []);
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddSize = () => {
    if (currentSize.size && currentSize.price && currentSize.quantity) {
      setCurrentVariant((prev) => ({
        ...prev,
        sizes: [...prev.sizes, { ...currentSize }],
      }));
      setCurrentSize(initialSizeData);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all size details",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSize = (index) => {
    setCurrentVariant((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, idx) => idx !== index),
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddVariant = () => {
    if (
      currentVariant.color &&
      uploadedImageUrl &&
      currentVariant.sizes.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        variants: [
          ...prev.variants,
          { ...currentVariant, image: uploadedImageUrl },
        ],
      }));
      setCurrentVariant(initialVariantData);
      setUploadedImageUrl("");
      setColorPickerOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Please add color, image and at least one size",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const isValid =
      formData.name &&
      formData.description &&
      formData.category &&
      formData.variants.length > 0;

    if (!isValid) {
      toast({
        title: "Validation Error",
        description:
          "Please fill all required fields and add at least one variant",
        variant: "destructive",
      });
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("data", JSON.stringify(formData));

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
  };

  function resetForm() {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl("");
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
            <div className="py-6 space-y-4">
              <Input
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
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

                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subcategory: value }))
                  }
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: checked,
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

              {/* Variant Section */}
              <div className="border p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Add New Variant</h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Color Name"
                        value={currentVariant.color}
                        onChange={(e) =>
                          setCurrentVariant((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button
                      onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    >
                      {colorPickerOpen ? "Close" : "Pick Color"}
                    </Button>
                  </div>

                  {colorPickerOpen && (
                    <div className="p-4 border rounded-md bg-white">
                      <ChromePicker
                        color={currentColor}
                        onChangeComplete={(color) => {
                          setCurrentColor(color.hex);
                          setCurrentVariant((prev) => ({
                            ...prev,
                            color: color.hex,
                          }));
                        }}
                      />
                    </div>
                  )}

                  <ImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    imageLoadingState={imageLoadingState}
                    uploadedImageUrl={uploadedImageUrl}
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    isEditMode={false}
                  />

                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Size"
                      value={currentSize.size}
                      onChange={(e) =>
                        setCurrentSize((prev) => ({
                          ...prev,
                          size: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={currentSize.price}
                      onChange={(e) =>
                        setCurrentSize((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Sale Price"
                      value={currentSize.salePrice}
                      onChange={(e) =>
                        setCurrentSize((prev) => ({
                          ...prev,
                          salePrice: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={currentSize.quantity}
                      onChange={(e) =>
                        setCurrentSize((prev) => ({
                          ...prev,
                          quantity: parseInt(e.target.value || 0),
                        }))
                      }
                    />
                  </div>

                  <Button onClick={handleAddSize} className="w-full">
                    Add Size
                  </Button>

                  <SizeList
                    sizes={currentVariant.sizes}
                    onRemoveSize={handleRemoveSize}
                  />

                  {currentVariant.sizes.length > 0 && (
                    <Button onClick={handleAddVariant} className="w-full">
                      Add Variant
                    </Button>
                  )}
                </div>
              </div>

              {/* Variants List */}
              {formData.variants.length > 0 && (
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Product Variants
                  </h3>
                  <div className="grid gap-4">
                    {formData.variants.map((variant, idx) => (
                      <VariantCard
                        key={idx}
                        variant={variant}
                        index={idx}
                        onRemoveVariant={handleRemoveVariant}
                      />
                    ))}
                  </div>
                </div>
              )}
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
                  formData.variants.length === 0
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
