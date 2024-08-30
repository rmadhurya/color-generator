import React, { useState, useEffect, useCallback, useRef} from 'react'; // Added useEffect import
import { FaTrashAlt, FaEdit, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import icons

// Sample images
const images = [
  'imgs/img-tiger.PNG',
  'imgs/img-elephant.PNG',
  'imgs/img-lavender.PNG'
];

// Function to generate a random color in hex format
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function App() {
  const [palette, setPalette] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [colorCount, setColorCount] = useState(5); // Default to 5 colors
  const [paletteTitle, setPaletteTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); // State to track if the start button was pressed
  const [isAnimating, setIsAnimating] = useState(false);
  const slideInterval = useRef(null); // Reference to the interval for auto-sliding
  const slideDuration = 3000; // Duration for auto-sliding (e.g., 3 seconds)

  // Function to go to the next slide
  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsAnimating(false);
    }, 500); // Slide animation duration (e.g., 500ms)
  };

  // Function to go to the previous slide
  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setIsAnimating(false);
    }, 500); // Slide animation duration (e.g., 500ms)
  };

  // Auto slide effect
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      handleNext();
    }, slideDuration);

    return () => {
      clearInterval(slideInterval.current); // Clear the interval when the component unmounts
    };
  }, []);

  // Reset the auto-slide interval whenever user interacts manually
  const resetAutoSlide = () => {
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      handleNext();
    }, slideDuration);
  };

  // Load saved palettes from local storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedPalettes')) || [];
    setSavedPalettes(saved);
  }, []);

  // Memoize the generatePalette function using useCallback
  const generatePalette = useCallback(() => {
    const newPalette = Array.from({ length: colorCount }, generateRandomColor);
    setPalette(newPalette);
  }, [colorCount]);

  // Automatically generate a default palette on component mount
  useEffect(() => {
    if (palette.length === 0) {
      generatePalette();
    }
  }, [generatePalette, palette.length]); // Adding dependencies here

  // Save the current palette
  const savePalette = () => {
    if (palette.length > 0) {
      const newPalette = { colors: palette, title: paletteTitle || `Palette ${savedPalettes.length + 1}` };
      const updatedSavedPalettes = [...savedPalettes, newPalette];
      setSavedPalettes(updatedSavedPalettes);
      localStorage.setItem('savedPalettes', JSON.stringify(updatedSavedPalettes));
      setPaletteTitle(''); // Clear the title input after saving
    }
  };

  // Delete a saved palette
  const deletePalette = (index) => {
    const updatedSavedPalettes = savedPalettes.filter((_, i) => i !== index);
    setSavedPalettes(updatedSavedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedSavedPalettes));
  };

  // Update a color
  const handleColorChange = (index, newColor) => {
    const updatedPalette = [...palette];
    updatedPalette[index] = newColor;
    setPalette(updatedPalette);
  };

  // Set a saved palette as the current generated palette
  const handlePaletteClick = (savedPalette) => {
    setPalette(savedPalette.colors);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-6 rounded-lg max-w-8xl w-full">
        <div className="text-content flex-1 pr-4">
          <h1 className="text-6xl text-center font-serif font-extralight mt-10 mb-14">Color Palette Generator</h1>
        </div>
        {!hasStarted && ( // Conditionally render the welcome message and slideshow if the user hasn't started
          <> 
            <div className="flex items-start bg-gray-100 p-6 rounded-lg drop-shadow-lg" style={{ width: '1200px', maxWidth: '100%', margin: '0 auto' }}>
              <div className="slideshow relative w-96 ml-10 mt-5 mb-5 transition-transform duration-500"
                    style={{
                      transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none'
                    }}  >
                {/* Left Arrow */}
                <button 
                    onClick={() => {
                      handlePrev();
                      resetAutoSlide();
                    }} 
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"
                  >
                    <FaArrowLeft size={24} />
                  </button>
                <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="rounded-lg w-full h-full object-cover" />
                {/* Right Arrow */}
                <button 
                    onClick={() => {
                      handleNext();
                      resetAutoSlide();
                    }} 
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"
                  >
                    <FaArrowRight size={24} />
                </button>
              </div>
              <div className="paragraph flex-1 pl-4">
                <p className="mt-28 mb-10 ml-10 mr-10 text-3xl text-center">
                  Welcome to the Color Palette Generator!                 
                </p>
                <p className="mb-16 mt-5 ml-10 mr-10 text-lg text-center">
                  This tool helps artists create and manage color palettes with ease. By generating a limited set of colors, you can maintain a cohesive color scheme that simplifies design choices and ensures consistency in your artwork. It’s perfect for when you need to make decisions quickly or want to experiment with color combinations in a controlled way.
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setHasStarted(true)} // Update state when start button is clicked
                    className="bg-blue-500 text-white px-8 py-4 rounded text-4xl animate-bounce"
                  >
                    Start
                  </button>
                </div>
                <p className="mt-10 ml-10 mr-10 text-lg text-center">
                  Made by Madhu Ratnakar
                </p>
              </div>
            </div>
          </>
        )}


        <div className="bg-white p-10 rounded-lg">
          <div className="mb-4 flex justify-center">
            <label className="mr-2">Number of Colors:</label>
            <input
              type="number"
              value={colorCount}
              min="1"
              max="20"
              onChange={(e) => setColorCount(parseInt(e.target.value, 10))}
              className="border px-2 py-1 rounded text-center"
            />
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={generatePalette}
              className="bg-blue-500 text-white px-5 py-2 rounded text-lg"
            >
              Generate Palette
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-auto-fit gap-3 w-full" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))` }}>
              {palette.length > 0 && palette.map((color, index) => (
                <div key={index} className="relative flex flex-col items-center group">
                  <div
                    className="h-72 w-full rounded"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="absolute bottom-2 text-black font-bold">{color}</span>

                  {/* Edit button with color input that appears on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                      onClick={() => document.getElementById(`color-picker-${index}`).click()}
                    >
                      <FaEdit size={30} />
                    </button>
                    <input
                      type="color"
                      id={`color-picker-${index}`}
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={savePalette}
              className="bg-green-500 text-white px-5 py-2 rounded text-lg"
              disabled={palette.length === 0}
            >
              Save Palette
            </button>
          </div>
          <h2 className="text-2xl mt-8 text-center">Saved Palettes</h2>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {savedPalettes.map((savedPalette, paletteIndex) => (
              <div
                key={paletteIndex}
                className="relative border rounded p-2 cursor-pointer group"
                onClick={() => handlePaletteClick(savedPalette)}
              >
                <div className="grid grid-cols-5 gap-1">
                  {savedPalette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="h-8 rounded" // Smaller color icons
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>{savedPalette.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from triggering modal
                      deletePalette(paletteIndex);
                    }}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
