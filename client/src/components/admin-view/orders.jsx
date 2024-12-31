import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import printJS from 'print-js';
import { QRCodeCanvas } from "qrcode.react";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const contentToPrint = useRef(null);

  const handlePrint = () => {
    printJS({
      printable: contentToPrint.current,
      type: 'html',
      targetStyles: ['*'],
      documentTitle: `Invoice-${selectedOrderId}`,
    });
  };

  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleViewDetails(orderId) {
    dispatch(getOrderDetailsForAdmin(orderId));
    setOpenDetailsDialog(true);
  }

  const handleViewInvoice = async (orderId) => {
    setSelectedOrderId(orderId);
    await dispatch(getOrderDetailsForAdmin(orderId));
    setOpenInvoiceDialog(true);
  };

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="overflow-x-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem, i) => (
                  <TableRow key={i}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>৳{orderItem?.totalAmount}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={(open) => {
                          setOpenDetailsDialog(open);
                          if (!open) dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() => handleViewDetails(orderItem._id)}
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>

                      <Dialog
                        open={openInvoiceDialog}
                        onOpenChange={(open) => {
                          setOpenInvoiceDialog(open);
                          if (!open) {
                            dispatch(resetOrderDetails());
                            setSelectedOrderId(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => handleViewInvoice(orderItem._id)}
                          >
                            Invoice
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Invoice</DialogTitle>
                            <DialogDescription>
                              Invoice details for order #{selectedOrderId}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {orderDetails && (
                            <div ref={contentToPrint} className="print-content p-8 bg-white">
                              <div className="invoice-header flex justify-between items-start mb-8">
                                <div>
                                  <h1 className="text-2xl font-bold mb-2">
                                    Invoice
                                  </h1>
                                  <p className="text-gray-600">
                                    Order #{orderDetails?._id}
                                  </p>
                                  <p className="text-gray-600">
                                    Date:{" "}
                                    {new Date(
                                      orderDetails?.orderDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <img
                                    src="/kidzo.png"
                                    alt="Logo"
                                    className="logo h-12 mb-2"
                                  />
                                  <p className="text-sm text-gray-600">
                                    81/4A West Brahmondi,
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Narsindi Sadar, Narsingdi
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Bill To:
                                  </h3>
                                  <p>{orderDetails?.addressInfo?.Name}</p>
                                  <p>{orderDetails?.addressInfo?.address}</p>
                                  <p>{orderDetails?.addressInfo?.city}</p>
                                  <p>{orderDetails?.addressInfo?.phone}</p>
                                </div>
                                <div className="text-right">
                                  <QRCodeCanvas
                                    value={JSON.stringify({
                                      orderId: orderDetails?._id,
                                      customerName:
                                        orderDetails?.addressInfo?.Name,
                                      status: orderDetails?.orderStatus,
                                      amount: orderDetails?.totalAmount,
                                      date: orderDetails?.orderDate,
                                    })}
                                    size={100}
                                    level={"H"}
                                    marginSize={true}
                                  />
                                </div>
                              </div>
                              <table className="w-full mb-8">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Item</th>
                                    <th className="text-center py-2">Size</th>
                                    <th className="text-center py-2">Color</th>
                                    <th className="text-center py-2">
                                      Quantity
                                    </th>
                                    <th className="text-right py-2">Price</th>
                                    <th className="text-right py-2">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orderDetails?.cartItems?.map(
                                    (item, index) => (
                                      <tr key={index} className="border-b">
                                        <td className="py-2">{item.name}</td>
                                        <td className="text-center py-2">
                                          {item.size}
                                        </td>
                                        <td className="text-center py-2">
                                          <div
                                            className="color-sample"
                                            style={{
                                              backgroundColor: item.color,
                                            }}
                                          />
                                        </td>
                                        <td className="text-center py-2">
                                          {item.quantity}
                                        </td>
                                        <td className="text-right py-2">
                                          ৳{item.price}
                                        </td>
                                        <td className="text-right py-2">
                                          ৳{item.price * item.quantity}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td
                                      colSpan="5"
                                      className="text-right pt-4 font-semibold"
                                    >
                                      Total:
                                    </td>
                                    <td className="text-right pt-4 font-semibold">
                                      ৳{orderDetails?.totalAmount}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                              <div className="border-t pt-4">
                                <p className="text-sm text-gray-600">
                                  Payment Status: {orderDetails?.paymentStatus}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Payment Method: {orderDetails?.paymentMethod}
                                </p>
                              </div>
                            </div>
                          )}

                          <DialogFooter>
                            <Button
                              onClick={handlePrint}
                              disabled={!orderDetails}
                            >
                              Print Invoice
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;