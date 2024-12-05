/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

function ProductImageUpload({
  imageFiles,
  setImageFiles,
  isEditMode,
  isCustomStyling = false,
  initialImages = [],
  setFormData
}) {
  const inputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialImages.length > 0) {
      setImagePreviews(initialImages);
    }
  }, [initialImages]);

  function handleImageFileChange(event) {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function removeImage(index) {
    if (index < initialImages.length) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
    else {
      const newFileIndex = index - initialImages.length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }


  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {imagePreviews?.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload images</span>
          </Label>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagePreviews?.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded cursor-pointer"
            >
              <UploadCloudIcon className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-sm">Add more</span>
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;