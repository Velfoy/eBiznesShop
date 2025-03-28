import { Link } from "react-router-dom";

const Products = () => {
  const products = [
    { id: 1, name: "Stylish Jacket", price: 49.99, image: "/jacket.jpg" },
    { id: 2, name: "Sneakers", price: 59.99, image: "/sneakers.jpg" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>${product.price}</p>
            <Link to={`/product/${product.id}`} className="text-blue-500">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
