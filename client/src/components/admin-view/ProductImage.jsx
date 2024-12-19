/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

function ProductImageUpload({
  currentImage,
  setCurrentImage,
  isEditMode = false
}) {
  const inputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setCurrentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setCurrentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setCurrentImage(null);
    setImagePreview(null);
  }

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">Variant Image</Label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleImageChange}
          disabled={isEditMode}
        />
        
        {!imagePreview ? (
          <Label
            onClick={() => !isEditMode && inputRef.current?.click()}
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={removeImage}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;