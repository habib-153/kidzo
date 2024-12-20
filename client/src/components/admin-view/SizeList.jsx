/* eslint-disable react/prop-types */
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function SizeList({ sizes, onRemoveSize }) {
    return (
      <div className="mt-4 space-y-2">
        {sizes?.map((size, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <div className="grid grid-cols-4 gap-4 flex-1">
              <span>Size: {size.size}</span>
              <span>Price: ৳{size.price}</span>
              {size.salePrice && <span>Sale: ৳{size.salePrice}</span>}
              <span>Qty: {size.quantity}</span>
            </div>
            <Button
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveSize(index)}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    );
  }