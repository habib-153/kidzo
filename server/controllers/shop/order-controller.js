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

    // Create the order
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

    // Reduce the product quantity
    for (let item of cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      const inventoryItem = product.inventory.find(
        (inv) => inv.size === item.size
      );

      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: `Size not found for product: ${item.title}`,
        });
      }

      if (inventoryItem.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.title} in size ${item.size}`,
        });
      }

      // Ensure totalStock is a valid number
      if (typeof product.totalStock !== 'number' || isNaN(product.totalStock)) {
        product.totalStock = 0;
      }

      // Ensure item.quantity is a valid number
      const quantityToReduce = parseInt(item.quantity, 10);
      if (isNaN(quantityToReduce)) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product: ${item.title}`,
        });
      }

      inventoryItem.quantity -= quantityToReduce;
      product.totalStock -= quantityToReduce;

      await product.save();
    }

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
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
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (product) {
        const inventoryItem = product.inventory.find(
          (inv) => inv.size === item.size
        );

        if (inventoryItem) {
          inventoryItem.quantity += item.quantity;
          product.totalStock += item.quantity;
          await product.save();
        }
      }
    }

    await Order.findByIdAndUpdate(id, { orderStatus: "cancelled" });

    res.status(200).json({
      success: true,
      message: "Order cancelled and product quantities restored",
    });
  } catch (e) {
    console.log(e);
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
    console.log(e);
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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  cancelOrder,
  getAllOrdersByUser,
  getOrderDetails,
};