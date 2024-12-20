/* eslint-disable react/prop-types */
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function VariantCard({ variant, index, onRemoveVariant }) {
    return (
      <div className="border rounded-lg p-4 mt-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full border"
              style={{backgroundColor: variant.color}}
            />
            <span className="font-medium">{variant.color}</span>
          </div>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => onRemoveVariant(index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        
        <div className="aspect-video relative rounded-md overflow-hidden mb-4">
          <img 
            src={variant.image} 
            alt={variant.color}
            className="object-cover w-full h-full"
          />
        </div>
  
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-600">Sizes:</h4>
          {variant?.sizes?.map((size, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 text-sm bg-gray-50 p-2 rounded">
              <span>Size: {size.size}</span>
              <span>Price: ৳{size.price}</span>
              <span>Qty: {size.quantity}</span>
              {size.salePrice && (
                <span className="text-green-600">Sale: ৳{size.salePrice}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }