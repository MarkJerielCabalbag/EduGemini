import MenuBar from "@/content/MenuBar";
import Navbar from "../content/Navbar";

function Home() {
  return (
    <div className="container sm:container md:container lg:container">
      <MenuBar />
      <h1>EduGemini: AI Assistant for CCS ISPSC</h1>
      <Navbar />
    </div>
  );
}

export default Home;
