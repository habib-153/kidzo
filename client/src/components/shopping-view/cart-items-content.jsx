/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(item, actionType) {
    // Example check for max quantity
    // You can also store available quantity in cartItem if needed
    if (actionType === "plus") {
      dispatch(
        updateCartQuantity({
          ...item,
          quantity: item.quantity + 1,
        })
      );
    } else if (actionType === "minus") {
      if (item.quantity > 1) {
        dispatch(
          updateCartQuantity({
            ...item,
            quantity: item.quantity - 1,
          })
        );
      }
    }
  }

  function handleDeleteItem(item) {
    dispatch(deleteCartItem(item));
    toast({ title: "Item removed from cart" });
  }

  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200">
      <div className="w-24 h-24 overflow-hidden rounded">
        <img
          src={cartItem?.image}
          alt={cartItem?.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.name}</h3>
        <div className="flex gap-2">
          <div className="text-sm text-neutral-600 mb-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span>Color:</span>
              <span
                className="inline-block w-4 h-4 rounded-full border"
                style={{ backgroundColor: cartItem?.color }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Size:</span>
              <span className="font-medium">{cartItem?.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Price:</span>
              <span className="font-medium">৳{cartItem?.price}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              disabled={cartItem.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-4 h-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="font-semibold">{cartItem.quantity}</span>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ৳{(cartItem.price * cartItem.quantity).toFixed(2)}
        </p>
        <Button
          variant="destructive"
          className="mt-2"
          size="sm"
          onClick={() => handleDeleteItem(cartItem)}
        >
          <Trash className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
