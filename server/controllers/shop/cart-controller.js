const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const handleErrorResponse = (res, message, status = 500) => {
  res.status(status).json({ success: false, message });
};

const addToCart = async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;
    if (!userId || !productId || !size || quantity <= 0) {
      return handleErrorResponse(res, "Invalid data provided!", 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return handleErrorResponse(res, "Product not found", 404);
    }

    let cart = await Cart.findOne({ userId }) || new Cart({ userId, items: [] });
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.size === size);

    if (itemIndex === -1) {
      cart.items.push({ productId, size, quantity });
    } else {
      cart.items[itemIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, "Error");
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return handleErrorResponse(res, "User id is mandatory!", 400);
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images name price sale_price",
    });

    if (!cart) {
      return handleErrorResponse(res, "Cart not found!", 404);
    }

    const validItems = cart.items.filter(item => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map(item => ({
      productId: item.productId._id,
      images: item.productId.images,
      name: item.productId.name,
      price: item.productId.price.get(item.size),
      sale_price: item.productId.sale_price.get(item.size),
      size: item.size,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, "Error");
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;
    if (!userId || !productId || !size || quantity <= 0) {
      return handleErrorResponse(res, "Invalid data provided!", 400);
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return handleErrorResponse(res, "Cart not found!", 404);
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.size === size);
    if (itemIndex === -1) {
      return handleErrorResponse(res, "Cart item not present!", 404);
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images name price sale_price",
    });

    const populateCartItems = cart.items.map(item => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId ? item.productId.price.get(item.size) : null,
      sale_price: item.productId ? item.productId.sale_price.get(item.size) : null,
      size: item.size,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, "Error");
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, size } = req.params;
    if (!userId || !productId || !size) {
      return handleErrorResponse(res, "Invalid data provided!", 400);
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images name price sale_price",
    });

    if (!cart) {
      return handleErrorResponse(res, "Cart not found!", 404);
    }

    cart.items = cart.items.filter(item => item.productId._id.toString() !== productId || item.size !== size);
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images name price sale_price",
    });

    const populateCartItems = cart.items.map(item => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId ? item.productId.price.get(item.size) : null,
      sale_price: item.productId ? item.productId.sale_price.get(item.size) : null,
      size: item.size,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, "Error");
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};