import Button from "../Button";

function NowPlayingSection() {
  return (
    <div className="lg:col-span-2 bg-background_light_secondary dark:bg-background_dark_secondary p-4 rounded-md  flex flex-col gap-2">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold dark:text-white text-background_dark ">
          Now Playing
        </h1>
        <Button size="sm">End stream</Button>
      </div>
      <div className="aspect-video  flex flex-col  gap-2">
        <iframe
          width="100%"
          height="90%"
          src={`https://www.youtube.com/embed/sfAHZYpCamU`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="flex items-center justify-between">
          <h3 className="dark:text-text_dark text-text_light flex flex-col">
            Blinding Lights{" "}
            <span className="dark:text-zinc-500 text-background_dark_secondary text-sm">
              The Weekend
            </span>
          </h3>
          <Button size="sm">Play Next</Button>
        </div>
      </div>
      <div className="flex  gap-2 ">
        <input
          type="text"
          placeholder="Paste YouTube URL here"
          className="dark:bg-background_dark bg-background_light px-2 rounded-md outline-none border-gray-700 text-white flex-grow placeholder:text-sm placeholder:text-background_dark placeholder:dark:text-white text-sm"
        />
        <Button size="sm">Add Song</Button>
      </div>
    </div>
  );
}

export default NowPlayingSection;
