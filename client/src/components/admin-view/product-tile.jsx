/* eslint-disable react/prop-types */
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.images[0]}
            alt={product?.name}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.name}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice && Object.keys(product.salePrice).length > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              {Object.entries(product?.price || {}).map(([size, price]) => (
                <div key={size}>
                  Size {size}: ${price}
                </div>
              ))}
            </span>
            {product?.salePrice && Object.keys(product.salePrice).length > 0 && (
              <span className="text-lg font-semibold text-red-500">
                {Object.entries(product.salePrice).map(([size, salePrice]) => (
                  <div key={size}>
                    Sale Size {size}: ${salePrice}
                  </div>
                ))}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
