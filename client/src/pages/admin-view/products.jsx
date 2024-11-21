import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
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
};

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  sizes: [],
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [currentSizeData, setCurrentSizeData] = useState(initialSizeData);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

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
        variant: "destructive",
      });
    }
  };

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
  };

  function onSubmit(event) {
    event.preventDefault();

    // Validate form data
    const isValid =
      formData.title &&
      formData.description &&
      formData.category &&
      formData.sizes.length > 0 &&
      uploadedImageUrl;

    if (!isValid) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in all required fields and add at least one size",
        variant: "destructive",
      });
      return;
    }

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
        });
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
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem.id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setCurrentSizeData(initialSizeData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6 space-y-4">
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
                      ...prev,
                      size: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={currentSizeData.price}
                  onChange={(e) =>
                    setCurrentSizeData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Stock"
                  type="number"
                  value={currentSizeData.totalStock}
                  onChange={(e) =>
                    setCurrentSizeData((prev) => ({
                      ...prev,
                      totalStock: e.target.value,
                    }))
                  }
                />
                <Button
                  variant="outline"
                  className="col-span-3 mt-2"
                  onClick={handleAddSize}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Size
                </Button>
              </div>

              {/* Added Sizes List */}
              {formData?.sizes.map((size, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border p-2 rounded mb-2"
                >
                  <div>
                    {size.size} - ${size.price} (Stock: {size.totalStock})
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSize(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={formData.sizes.length === 0 || !uploadedImageUrl}
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
