import { Link } from "react-router-dom";
import HeroSlider from "./HeroSlider";
import BestSellingProducts from "./BestSellingProducts";

const Home = () => {
  return (
    <div className="text-center" style={{"width":"100%"}}>
      <HeroSlider/>
      <BestSellingProducts/>
      <p>Find the best fashion deals here.</p>
      <Link to="/products" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Browse Products
      </Link>
    </div>
  );
};

export default Home;
