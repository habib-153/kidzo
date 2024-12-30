import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchAllAddresses } from "@/store/shop/address-slice";
import { useNavigate } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.price > 0
              ? currentItem?.price
              : currentItem?.price?.[currentItem.size]) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiateOrder() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (user && !currentSelectedAddress) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!user && !currentSelectedAddress) {
      toast({
        title: "Please provide your address to proceed.",
        variant: "destructive",
      });
      return;
    }
    const orderData = {
      userId: user?.id || null,
      cartItems: cartItems.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        variantId: singleCartItem?.variantId,
        name: singleCartItem?.name,
        color: singleCartItem?.color,
        size: singleCartItem?.size,
        image: singleCartItem?.image,
        price: singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: currentSelectedAddress,
      orderStatus: "pending",
      paymentMethod: "cash on delivery",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Order placed successfully",
        });
        navigate("/shop/home");
      } else {
        toast({
          title: "Failed to place order",
          variant: "destructive",
        });
      }
    });
  }

  const isAddressValid =
    currentSelectedAddress &&
    Object.values(currentSelectedAddress).every((value) => value.trim() !== "");

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
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
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">৳{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiateOrder}
              disabled={!isAddressValid}
              className="w-full"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
