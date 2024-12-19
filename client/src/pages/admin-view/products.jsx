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
import ProductImageUpload from "@/components/admin-view/ProductImage";
import { manageProduct } from "@/store/shop/products-slice";
import { ChromePicker } from "react-color";

const CATEGORIES = ["Boys", "Girls"];

const initialVariantData = {
  color: "",
  image: "",
  sizes: []
};

const initialSizeData = {
  size: "",
  price: "",
  salePrice: "",
  quantity: 0
};

const initialFormData = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  brand: "",
  tags: [],
  variants: [],
  featured: false
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentSize, setCurrentSize] = useState(initialSizeData);
  const [currentVariant, setCurrentVariant] = useState(initialVariantData);
  const [imageFiles, setImageFiles] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [currentColor, setCurrentColor] = useState("#000000");

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

  const handleAddSize = () => {
    if (currentSize.size && currentSize.price && currentSize.quantity) {
      setCurrentVariant(prev => ({
        ...prev,
        sizes: [...prev.sizes, {...currentSize}]
      }));
      setCurrentSize(initialSizeData);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all size details",
        variant: "destructive"
      });
    }
  };

  const handleAddVariant = () => {
    if (currentVariant.color && currentVariant.image && currentVariant.sizes.length > 0) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, {...currentVariant}]
      }));
      setCurrentVariant(initialVariantData);
      setColorPickerOpen(false);
    } else {
      toast({
        title: "Error", 
        description: "Please add color, image and at least one size",
        variant: "destructive"
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
        description: "Please fill all required fields and add at least one variant",
        variant: "destructive"
      });
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("data", JSON.stringify(formData));
    
    imageFiles.forEach(file => {
      submitFormData.append("Images", file);
    });

    dispatch(manageProduct({
      id: currentEditedId,
      formData: submitFormData
    })).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        resetForm();
        toast({
          title: `Product ${currentEditedId ? "updated" : "added"} successfully`
        });
      }
    });
  };

  function resetForm() {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFiles([]);
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

              <div className="border p-4 rounded-md mb-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Product Variants</h3>
                
                <div className="flex gap-4 mb-4">
                  <Input
                    placeholder="Color Name" 
                    value={currentVariant.color}
                    onChange={e => setCurrentVariant(prev => ({
                      ...prev,
                      color: e.target.value
                    }))}
                  />
                  <Button onClick={() => setColorPickerOpen(!colorPickerOpen)}>
                    Pick Color
                  </Button>
                </div>
              
                {colorPickerOpen && (
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
                )}
              
                <ProductImageUpload
                  currentImage={currentVariant.image}
                  setCurrentImage={(file) => setCurrentVariant(prev => ({
                    ...prev, 
                    image: file
                  }))}
                />
              
                <div className="grid grid-cols-4 gap-2">
                  <Input 
                    placeholder="Size"
                    value={currentSize.size}
                    onChange={e => setCurrentSize(prev => ({
                      ...prev,
                      size: e.target.value
                    }))}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={currentSize.price}
                    onChange={e => setCurrentSize(prev => ({
                      ...prev,
                      price: e.target.value
                    }))}
                  />
                  <Input
                    type="number" 
                    placeholder="Sale Price"
                    value={currentSize.salePrice}
                    onChange={e => setCurrentSize(prev => ({
                      ...prev,
                      salePrice: e.target.value
                    }))}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={currentSize.quantity} 
                    onChange={e => setCurrentSize(prev => ({
                      ...prev,
                      quantity: parseInt(e.target.value)
                    }))}
                  />
                </div>
              
                <Button onClick={handleAddSize}>Add Size</Button>
                <Button onClick={handleAddVariant}>Add Variant</Button>
              
                {formData.variants.map((variant, idx) => (
                  <div key={idx} className="border p-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{backgroundColor: variant.color}}
                      />
                      <span>{variant.color}</span>
                    </div>
                    
                    <div className="mt-2">
                      {variant.sizes.map((size, sizeIdx) => (
                        <div key={sizeIdx}>
                          Size: {size.size} - Price: ৳{size.price}
                          {size.salePrice && ` - Sale: ৳${size.salePrice}`}
                          - Qty: {size.quantity}
                        </div>
                      ))}
                    </div>
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
                disabled={!formData.name || !formData.description || !formData.category || formData.variants.length === 0}
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