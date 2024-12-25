/* eslint-disable react/prop-types */
import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: "Failed to update status",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto p-0">
      <div className="text-center mt-3">
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>Details of the selected order</DialogDescription>
      </div>

      {/* Overall Layout */}
      <div className="grid md:grid-cols-2 gap-8 p-8 max-h-[70vh] overflow-y-auto">
        {/* Order Info & Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>
              {orderDetails?.orderDate
                ? new Date(orderDetails.orderDate).toLocaleDateString()
                : ""}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "pending"
                    ? "bg-yellow-500"
                    : orderDetails?.orderStatus === "inProcess"
                    ? "bg-blue-500"
                    : orderDetails?.orderStatus === "inShipping"
                    ? "bg-purple-500"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "cancelled"
                    ? "bg-orange-500"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Total Amount</p>
            <Label>৳{orderDetails?.totalAmount?.toFixed(2)}</Label>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="space-y-4">
          <p className="font-medium">Shipping Info</p>
          <div className="grid gap-0.5 text-muted-foreground">
            <span> Address : {orderDetails?.addressInfo?.address}</span>
            <span>City : {orderDetails?.addressInfo?.city}</span>
            <span> Name : {orderDetails?.addressInfo?.Name}</span>
            <span>Phone : {orderDetails?.addressInfo?.phone}</span>
            <span>Notes :{orderDetails?.addressInfo?.notes}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Order Items & Update Form */}
      <div className="p-8 space-y-4">
        <div className="font-medium">Order Items</div>
        <ul className="grid gap-3">
          {Array.isArray(orderDetails?.cartItems) &&
          orderDetails.cartItems.length > 0 ? (
            orderDetails.cartItems.map((item, i) => (
              <li
                key={`${item.productId}-${item.size}-${i}`}
                className="flex items-center justify-between bg-neutral-50 p-3 rounded"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      Color:
                      <span
                        style={{ backgroundColor: item.color }}
                        className="inline-block w-4 h-4 rounded-full border"
                      />
                    </p>
                  </div>
                </div>
                <p className="font-bold">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))
          ) : (
            <p className="text-neutral-500 italic">No items in this order</p>
          )}
        </ul>

        <Separator />

        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
                { id: "cancelled", label: "Cancelled" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText="Update Order Status"
          onSubmit={handleUpdateStatus}
        />
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
