import { Link } from "react-router-dom";
import HeroSlider from "./HeroSlider";
import BestSellingProducts from "./BestSellingProducts";
import HomeBottomInfo from "./HomeBottomInfo";
import FeaturedCategories from "./FeaturedCategories";
import RecommendedProducts from "./RecommendedProducts";

const Home = () => {
  return (
    <div className="text-center" style={{"width":"100%"}}>
      <HeroSlider/>
      <FeaturedCategories/>
      <RecommendedProducts/>
      <BestSellingProducts/>
      <HomeBottomInfo/>
    </div>
  );
};

export default Home;
