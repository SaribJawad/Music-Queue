"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Users, Plus, Music } from "lucide-react";
import axios from "axios";
import AppBar from "../components/AppBar";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Card, CardContent } from "@/components/ui/card";
import { YT_REGEX } from "../lib/utils";

//  TYPESS

interface User {
  id: string;
  email: string;
  provider: string;
  stream: Video[];
  upvotes: UpVote[];
}

interface UpVote {
  id: string;
  userid: string;
  streamId: string;
}

interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  bigImg: string;
  smallImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function DashboardPage() {
  const [queue, setQueue] = useState<Video[]>([]);
  const [newSongUrl, setNewSongUrl] = useState("");
  const [currentSong, setCurrentSong] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshStream = async () => {
    const res = await axios.get(`/api/streams/my`, {
      withCredentials: true,
    });
    setQueue(res.data.streams);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshStream();
    }, REFRESH_INTERVAL_MS);
  }, []);

  const handleVote = async (songId: string, isUpvote: boolean) => {
    setQueue(
      queue.map((song) =>
        song.id === songId
          ? {
              ...song,
              upvotes: isUpvote ? song.upvotes + 1 : song.upvotes - 1,
              haveUpvoted: !song.haveUpvoted,
            }
          : song
      )
    );

    const res = await axios.post(
      `/api/streams/${isUpvote ? "upvote" : "downvote"}`,
      {
        streamId: songId,
      },
      {
        withCredentials: true,
      }
    );
  };

  const handleAddToQueue = async () => {
    setIsLoading(true);

    const res = await axios.post("/api/streams", {
      creatorId: "8a9e8e18-67f6-4762-8956-a1adf13a5bbf",
      url: newSongUrl,
    });

    setQueue([...queue, res.data]);
    setIsLoading(false);
    setNewSongUrl("");
  };

  const handlePlayNext = (title: string) => {
    // TODO
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex  flex-col items-center">
      <AppBar />
      <div className="  max-w-[900px] w-full">
        <header className="bg-gray-900 border-b  border-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" alt="Creator" />
                <AvatarFallback>DJ</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">DJ Awesome's Stream</h1>
                <p className="text-sm text-gray-400">Live now</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Share
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="aspect-video mb-4">
                {/* <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentSong.videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe> */}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <h3 className="font-semibold">Title</h3>
                  <p className="text-sm text-gray-400">Artist</p>
                </div>
                <Button
                  onClick={() => handlePlayNext("title")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Play Next
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Add a Song to the Queue</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="text"
                placeholder="Paste YouTube URL here"
                value={newSongUrl}
                onChange={(e) => setNewSongUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white flex-grow"
              />
              <Button
                disabled={isLoading}
                onClick={handleAddToQueue}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />{" "}
                {isLoading ? "Loading..." : "Add Song"}
              </Button>
            </div>
          </div>

          {newSongUrl && newSongUrl.match(YT_REGEX) && !isLoading && (
            <Card className="bg-gray-700 ">
              <CardContent className="p-4">
                <LiteYouTubeEmbed id={newSongUrl.split("?v=")[1]} title="" />
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-bold mb-4">Vote for the Next Song</h2>

          <div className="space-y-4">
            {queue.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between"
              >
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div className="bg-gray-700 p-2 rounded-full">
                    <Music className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{song.title}</h3>
                    {/* <p className="text-sm text-gray-400">{song.}</p> */}
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-10 sm:ml-0">
                  {/* <p className="text-sm text-gray-400">duratioz</p> */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleVote(song.id, song.haveUpvoted ? false : true)
                      }
                      className="hover:bg-gray-700"
                    >
                      {song.haveUpvoted ? (
                        <ArrowDown className="h-4 w-4 text-red-400" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-green-400" />
                      )}
                      <span className="ml-1 text-sm">{song.upvotes}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Voting Progress</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              {/* {queue.map((song) => { */}
              {/* const totalVotes = song.upvotes + song.downvotes;
              const upvotePercentage =
                totalVotes > 0 ? (song.upvotes / totalVotes) * 100 : 0;
              return ( */}
              <div className="mb-4 last:mb-0">
                <div className="flex flex-col sm:flex-row justify-between mb-1">
                  <span className="text-sm font-medium mb-1 sm:mb-0">
                    Title song
                  </span>
                  <span className="text-sm font-medium">
                    {/* {upvotePercentage.toFixed(1)}% upvotes */}
                    upvote percentage
                  </span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              {/* ); */}
              {/* })} */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
