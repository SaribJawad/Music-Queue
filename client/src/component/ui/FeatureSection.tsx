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
      className="bg-background_light_secondary dark:bg-background_dark_secondary w-full   text-center py-20 px-5 flex flex-col items-center gap-10 "
    >
      <h1 className="dark:text-text_dark text-text_light text-4xl sm:text-5xl font-semibold">
        Features
      </h1>
      <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:w-[80%] gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="dark:bg-background_dark bg-background_dark p-6 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer duration-300 transform hover:-translate-y-1 flex flex-col gap-10"
          >
            <h3 className="text-xl text-text_dark font-semibold mb-2">
              {feature.title}
            </h3>
            <p className="dark:text-white text-sm text-white">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
