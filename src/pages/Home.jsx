import { Link } from "react-router-dom";
import HeroSlider from "./HeroSlider";
import BestSellingProducts from "./BestSellingProducts";
import HomeBottomInfo from "./HomeBottomInfo";

const Home = () => {
  return (
    <div className="text-center" style={{"width":"100%"}}>
      <HeroSlider/>
      <BestSellingProducts/>
      <HomeBottomInfo/>
    </div>
  );
};

export default Home;
