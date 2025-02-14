import { ArrowRight } from "lucide-react";

function HowItWorks() {
  const steps = [
    "Create a music room or join an existing one",
    "Add songs from YouTube or SoundCloud to the queue",
    "Vote on songs to influence the playlist",
    "Enjoy the music with friends in real-time",
  ];

  return (
    <section
      id="how-it-works"
      className="bg-background_light dark:bg-background_dark w-full   text-center py-20 flex px-5 flex-col gap-10 "
    >
      <h1 className="dark:text-text_dark text-text_light text-4xl sm:text-5xl font-semibold">
        How it works
      </h1>
      <div className="max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center mb-8">
            <div className="bg-background_light_secondary dark:text-text_light rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-base md:text-lg dark:text-white">{step}</p>
            {index < steps.length - 1 && (
              <ArrowRight className="h-6 w-6 text-purple-500 mx-4" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
