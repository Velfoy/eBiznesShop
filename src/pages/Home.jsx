import { Link } from "react-router-dom";
import HeroSlider from "./HeroSlider";

const Home = () => {
  return (
    <div className="text-center" style={{"width":"100%"}}>
      <HeroSlider/>
      <h1 className="text-3xl font-bold">Welcome to FashFlow</h1>
      <p>Find the best fashion deals here.</p>
      <Link to="/products" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Browse Products
      </Link>
    </div>
  );
};

export default Home;
