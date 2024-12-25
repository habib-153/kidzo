/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.product?.sale_price?.[currentItem.size] > 0
              ? currentItem?.product?.sale_price?.[currentItem.size]
              : currentItem?.product?.price?.[currentItem.size]) *
              currentItem?.quantity,
          0
        )
      : 0;
  console.log(cartItems);

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              key={item.productId + item.size}
              cartItem={item}
            />
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">৳{totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
        disabled={cartItems.length === 0}
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
