import MenuBar from "@/content/MenuBar";
import Navbar from "../content/Navbar";
import Video from "@/utils/Video";
import mainbg from "../assets/main-bg.mp4";
function Home() {
  return (
    <>
      <MenuBar />
      <Video
        src={mainbg}
        className={"w-screen h-screen absolute top-0 -z-50"}
      />
      <div className="sm:container md:container lg:container">
        <div>
          <h1>Edu-Gemini</h1>
          <p></p>
        </div>
      </div>
      <Navbar />
    </>
  );
}

export default Home;
