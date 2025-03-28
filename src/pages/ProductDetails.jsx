import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-2xl">Product Details for ID: {id}</h1>
      {/* Fetch product data and display */}
    </div>
  );
};

export default ProductDetail;
