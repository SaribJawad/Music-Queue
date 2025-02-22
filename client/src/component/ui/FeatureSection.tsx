function FeatureSection() {
  const features = [
    {
      title: "Create Music Rooms",
      description: "Host your own music streams and invite friends to join.",
    },
    {
      title: "Vote on Songs",
      description: "Upvote or downvote songs to influence the playlist.",
    },
    {
      title: "YouTube Integration",
      description: "Add your favorite YouTube songs to the queue.",
    },
    {
      title: "SoundCloud Support",
      description: "Integrate SoundCloud tracks into your music streams.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-accent dark:bg-background_blue w-full   text-center py-20 px-5 flex flex-col items-center gap-10 "
    >
      <h1 className=" text-text_dark text-3xl sm:text-5xl font-semibold">
        Features
      </h1>
      <div className="w-full grid lg:grid-cols-4  grid-cols-2 sm:w-[80%] gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-background_light_secondary  dark:bg-background_dark sm:p-6 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer duration-300 transform hover:-translate-y-1 flex flex-col justify-between gap-10"
          >
            <h3 className="sm:text-xl text-sm text-text_light font-semibold mb-2 dark:text-white">
              {feature.title}
            </h3>
            <p className="dark:text-white sm:text-sm text-xs  text-text_light">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
