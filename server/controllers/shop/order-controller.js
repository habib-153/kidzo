const Order = require("../../models/Order");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    } = req.body;

    // 1) For each item, attempt to reduce inventory if your business logic requires it
    //    This assumes:
    //      - Product has "variants" containing multiple variant subdocs
    //      - Each variant has "sizes" that store quantity for each size
    // Adjust to match your schema or remove the quantity decrement logic if you do not track stock.

    for (const item of cartItems) {
      // Find the product by its _id
      const productDoc = await Product.findById(item.productId);
      if (!productDoc) {
        return res.status(400).json({
          success: false,
          message: `Product not found for ID: ${item.productId}`,
        });
      }

      // Locate the specific variant by _id
      const variantDoc = productDoc.variants.id(item.variantId);
      if (!variantDoc) {
        return res.status(400).json({
          success: false,
          message: `Variant not found for ID: ${item.variantId}`,
        });
      }

      // Locate the size record inside that variant
      const sizeObj = variantDoc.sizes.find((sz) => sz.size === item.size);
      if (!sizeObj) {
        return res.status(400).json({
          success: false,
          message: `Size ${item.size} not found in variant ${item.variantId}`,
        });
      }

      // Ensure there is enough stock
      if (sizeObj.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for size ${item.size}. Available: ${sizeObj.quantity}`,
        });
      }

      // Decrement quantity
      sizeObj.quantity -= item.quantity;
      await productDoc.save();
    }

    // 2) Create the order
    const newlyCreatedOrder = new Order({
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    });

    await newlyCreatedOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order created successfully!",
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    // You can console.log(e) for debugging
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Restore the product quantity
    for (const item of order.cartItems) {
      const productDoc = await Product.findById(item.productId);
      if (productDoc) {
        const variantDoc = productDoc.variants.id(item.variantId);
        if (variantDoc) {
          const sizeObj = variantDoc.sizes.find(sz => sz.size === item.size);
          if (sizeObj) {
            sizeObj.quantity += item.quantity;
            productDoc.totalStock += item.quantity;
            await productDoc.save();
          }
        }
      }
    }

    await Order.findByIdAndUpdate(id, { orderStatus: "cancelled" });

    res.status(200).json({
      success: true,
      message: "Order cancelled and product quantities restored",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    // Delete the order
    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting order"
    });
  }
};
module.exports = {
  createOrder,
  cancelOrder,
  getAllOrdersByUser,
  getOrderDetails,
  deleteOrder,
};