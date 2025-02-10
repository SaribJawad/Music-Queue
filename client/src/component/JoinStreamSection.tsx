import Button from "./Button";

function JoinStreamSection() {
  return (
    <div className="dark:bg-background_dark_secondary bg-background_light_secondary rounded-md p-4 flex flex-col gap-4 h-[500px]">
      <h1 className="dark:text-white text-text_light text-xl sm:text-2xl font-semibold text-center ">
        choose stream section
      </h1>
      <div className="flex flex-col gap-3 overflow-auto">
        <div className="dark:bg-background_dark bg-background_light text-text_light dark:text-text_dark  p-4 flex items-center justify-between rounded-md w-full gap-4">
          <h1>Sarib Jawad's stream</h1>
          <Button size="sm">Join Stream</Button>
        </div>
      </div>
    </div>
  );
}

export default JoinStreamSection;
