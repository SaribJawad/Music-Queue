import SongQueueList from "./SongQueueList";

function SongQueueDisplaySection() {
  return (
    <section className="xl:w-[400px] w-full flex flex-col gap-4 xl:min-h-[calc(100vh-144px)] ">
      <h1 className="font-semibold text-center flex-shrink-0">
        Song/Video Queue
      </h1>
      <section className="flex-1 min-h-0 overflow-y-auto ">
        <div className="flex flex-col gap-3 xl:max-h-[0px] max-h-[400px]">
          <SongQueueList />
          <SongQueueList />
        </div>
      </section>
    </section>
  );
}

export default SongQueueDisplaySection;
