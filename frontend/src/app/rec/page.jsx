"use client";
import LoadingSpinner from "@/components/spinner/page";
import { useRef, useState ,useEffect} from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [suggestedSong, setSuggestedSong] = useState("");
  const [loading, setLoading] = useState(false);
  const [recTypes, setRecTypes] = useState("Emotion Detection");
  const [title, setTitle] = useState(null);
  const [story, setStory] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [emotion, setEmotion] = useState("");

  const displayRef = useRef(null);

  const scrollToBottom = () => {
    displayRef.current.scrollTop = displayRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [title,story,imgUrl]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            if (blob) {
              setPhotoTaken(true);
              setPhotoSrc(URL.createObjectURL(blob));
            }
          }, "image/png");
        }
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleClosePhoto = () => {
    setPhotoTaken(false);
    setPhotoSrc(null);
    setApiResponse(null);
    setLoading(false);
  };

  async function predictImage() {
    if (loading) return;
    setLoading(true);
    try {
      const url = "http://172.17.26.154:8080/predict";
      const image_path = photoSrc;

      const formData = new FormData();
      formData.append(
        "image",
        await fetch(image_path).then((response) => response.blob()),
        "img2.png"
      );

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
        const emotion = data.label; // Assuming 'label' from the response is the emotion
        console.log(`Predicted emotion: ${emotion}`);
        setEmotion(emotion);

        // Call the second API with the predicted emotion
        const suggestSongUrl = "http://gigagen.pythonanywhere.com/suggest_song";
        const suggestSongResponse = await fetch(suggestSongUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emotion }),
        });

        if (suggestSongResponse.ok) {
          const songData = await suggestSongResponse.json();
          // console.log("Suggested song:", songData);
          setSuggestedSong(songData.response);
          setLoading(false);
        } else {
          console.error(
            "Error while suggesting song:",
            suggestSongResponse.status
          );
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const recType = [
    {
      id: "1",
      type: "Emotion Detection",
    },
    {
      id: "2",
      type: "Story",
    },
  ];

  async function generateStoryTitleAndImage(emotion) {
    if(!emotion) return;
    try {
      // First, generate the story
      const storyGenerationUrl =
        "http://gigagen.pythonanywhere.com/emotion_to_story";
      const storyGenerationResponse = await fetch(storyGenerationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion }),
      });

      if (!storyGenerationResponse.ok) {
        throw new Error(
          `Failed to generate story. Status: ${storyGenerationResponse.status}`
        );
      }

      const storyGenerationData = await storyGenerationResponse.json();
      const story = storyGenerationData.story;
      console.log("story", story);
      setStory(story);

      // Next, generate the title for the story
      const titleGenerationUrl =
        "http://gigagen.pythonanywhere.com/story_title_generation";
      const titleGenerationResponse = await fetch(titleGenerationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story }),
      });

      if (!titleGenerationResponse.ok) {
        throw new Error(
          `Failed to generate title. Status: ${titleGenerationResponse.status}`
        );
      }

      const titleGenerationData = await titleGenerationResponse.json();
      const title = titleGenerationData.title;
      console.log("title", title);
      setTitle(title);

      // Finally, generate the image based on the story
      const imageGenerationUrl =
        "http://gigagen.pythonanywhere.com/generate_image";
      const imageGenerationResponse = await fetch(imageGenerationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: story }),
      });

      if (!imageGenerationResponse.ok) {
        const errorData = await imageGenerationResponse.json();
        throw new Error(`Failed to generate image. Error: ${errorData.error}`);
      }

      const imageGenerationData = await imageGenerationResponse.json();
      const imageUrl = imageGenerationData.image_url;

      console.log("imageUrl", imageUrl);
      setImgUrl(imageUrl);

      // Store the data as needed
      const generatedData = { story, title, imageUrl };
      console.log("Generated Data:", generatedData);

      // return generatedData;
    } catch (error) {
      console.error("Error:", error.message);
      return null; // Or handle error appropriately
    }
  }

  const handleRecType = (type) => {
    console.log(type);
    setRecTypes(type);
    if (type === "Story") {
      if(emotion !==""){
        generateStoryTitleAndImage(emotion);
      }
      setRecTypes("Emotion Detection");
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[90.1vh] bg-black py-8">
      <div className="main-content flex flex-col bg-zinc-900 p-4 py-8 rounded-sm w-[80%] min-h-[60vh] text-white " ref={displayRef}>
        <div className="rec-heading font-bold text-white flex text-xl justify-center mb-4 ">
          Recommendation:
          {/* <div className="chat-bot-options flex justify-between">
            {recType.map((data) => (
              <span
                key={data.id}
                className={`p-2 w-64 text-center border-2 rounded-md border-slate-400 m-1 cursor-pointer hover:bg-indigo-800 text-white hover:border-0 ${
                  recTypes === data.type ? "bg-indigo-800 border-0" : ""
                }`}
                onClick={() => {
                  handleRecType(data.type);
                }}
              >
                {data.type}
              </span>
            ))}
          </div> */}
        </div>
        {/* {recTypes === "Emotion Detection" ? (
          <> */}
            <div className="image-div flex justify-center">
              <div className="flex flex-col m-4 ">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-96 h-72 border border-gray-300 rounded-md bg-black"
                ></video>

                {!photoTaken && !cameraStarted && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 my-2"
                    onClick={startCamera}
                  >
                    Start Camera
                  </button>
                )}

                {!photoTaken && cameraStarted && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600  my-2"
                    onClick={capturePhoto}
                  >
                    Capture Photo
                  </button>
                )}
              </div>

              {photoTaken && (
                <div className="mb-4 m-4">
                  <img
                    src={photoSrc ?? ""}
                    alt="Captured Photo"
                    className="w-96 h-72 border border-gray-300 rounded-md"
                  />
                  <div>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 m-2"
                      onClick={predictImage}
                    >
                      Send to API
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2 m-2"
                      onClick={handleClosePhoto}
                    >
                      Discard Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <LoadingSpinner/>
            ) : (
              <>
                {suggestedSong !== "" ? (
                  <>
                    <a
                      href={`https://www.youtube.com/results?search_query= ${suggestedSong}`}
                      className="text-white cursor-pointer"
                    >
                      Suggested Song:{" "}
                      <span className="hover:text-white cursor-pointer ita text-indigo-600">
                        {suggestedSong}
                      </span>
                    </a>
                    <button className="text-white hover:text-indigo" onClick={generateStoryTitleAndImage(emotion)}>Generate Story</button>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            {apiResponse && (
              <div>
                <p>API Response:</p>
                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            )}
          {/* </>
        ) : (
          <> */}
            {story || title || imgUrl ? (
              <>
                <div className="story-content px-8 py-4 flex flex-col items-center h-[60vh] overflow-y-scroll">
                  {title ? (
                    <div className="title text-center mb-2">
                      {" "}
                      <span className=" text-white">Title :</span>{" "}
                      <span className="font-bold text-lg">{title}</span>
                    </div>
                  ) : (
                    <LoadingSpinner />
                  )}

                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-[30rem] h-[20rem] my-6"
                    />
                  ) : (
                    <LoadingSpinner />
                  )}

                  {story ? (
                    <div className="story text-gray-400">{story}</div>
                  ) : (
                    <LoadingSpinner />
                  )}
                </div>
              </>
            ) : (
              // <LoadingSpinner />
              <></>
            )}
          {/* </>
        )} */}
      </div>
    </div>
  );
};

export default Camera;
