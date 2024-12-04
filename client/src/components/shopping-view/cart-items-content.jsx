/* eslint-disable react/prop-types */
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  //const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    const inventory = getCartItem.product.inventory.find(
      (item) => item.size === getCartItem.size
    );

    if (typeOfAction === "plus" && getCartItem.quantity >= inventory.quantity) {
      toast({
        title: `Only ${inventory.quantity} items available`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateCartQuantity({
        productId: getCartItem.productId,
        size: getCartItem.size,
        quantity:
          typeOfAction === "plus"
            ? getCartItem.quantity + 1
            : getCartItem.quantity - 1,
      })
    );
    toast({
      title: "Cart item updated",
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        productId: getCartItem.productId,
        size: getCartItem.size,
      })
    );
    toast({
      title: "Cart item deleted successfully",
      variant: "destructive",
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.product.images[0]}
        alt={cartItem.product.name}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem.product.name}</h3>
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
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ৳
          {(
            (cartItem.product.sale_price?.[cartItem.size] > 0
              ? cartItem.product.sale_price[cartItem.size]
              : cartItem.product.price[cartItem.size]) * cartItem.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
