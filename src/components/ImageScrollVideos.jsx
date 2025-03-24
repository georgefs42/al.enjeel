import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { supabase } from "../supabase"; // Import supabase client

const ImageScrollVideos = forwardRef((props, ref) => {
  const [items, setItems] = useState([]); // State to store media items from Supabase
  const [selectedVideo, setSelectedVideo] = useState(null); // State to store the selected video URL
  const scrollRef = useRef(null);

  // Fetch media items from Supabase when the component mounts
  useEffect(() => {
    async function fetchMedia() {
      const { data, error } = await supabase.from("media_items").select("*");
      if (error) {
        console.error("Error fetching media:", error);
      } else {
        setItems(data); // Update state with fetched media items
      }
    }
    fetchMedia();
  }, []); // Empty dependency array to run this only once on mount

  // Function to handle smooth scrolling
  const scrollSmooth = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * 200, // Scroll by 200px left or right
        behavior: "smooth", // Smooth scrolling effect
      });
    }
  };

  // Expose scrollSmooth function to the parent component via ref
  useImperativeHandle(ref, () => ({
    scrollSmooth,
  }));

  return (
    <div className="p-4">
      {/* Image Scroll Bar */}
      <div className="relative w-full overflow-hidden">
        {/* Left Scroll Button */}
        <button
          className="absolute left-0 bg-gray-800 text-white p-2 rounded-l-md"
          onClick={() => scrollSmooth(-1)}
        >
          ◀
        </button>

        {/* Image Bar */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll no-scrollbar scroll-smooth space-x-4 p-2"
        >
          {items.map((item) => (
            <img
              key={item.id}
              src={item.image_url}
              alt={`Thumbnail ${item.id}`}
              className="w-32 h-32 object-cover cursor-pointer rounded-lg border-2 border-gray-300 hover:border-blue-500"
              onClick={() => setSelectedVideo(item.video_url)} // Set selected video on click
            />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className="absolute right-0 bg-gray-800 text-white p-2 rounded-r-md"
          onClick={() => scrollSmooth(1)}
        >
          ▶
        </button>
      </div>

      {/* Video Section */}
      {selectedVideo && (
        <div className="mt-4">
          <video controls className="w-full max-w-lg mx-auto rounded-lg shadow-lg">
            <source src={selectedVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
});

export default ImageScrollVideos;
