import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Users, Radio, ArrowRight } from "lucide-react";
import AppBar from "./components/AppBar";
import Redirect from "./components/Redirect";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100">
      <AppBar />
      <Redirect />
      <main className="flex-1 w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  Let Your Fans Choose the Beat
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-700 text-sm sm:text-base md:text-xl dark:text-gray-300">
                  FanTune: Where creators and fans collaborate on the perfect
                  stream soundtrack.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-purple-600 text-purple-600 hover:bg-purple-100 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/50"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white/50 backdrop-blur-sm dark:bg-gray-800/30 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-purple-600 dark:text-purple-400">
              How It Works
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-purple-100 dark:bg-gray-800">
                <Play className="h-12 w-12 mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                  Start Your Stream
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Begin your broadcast and connect with your audience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-pink-100 dark:bg-gray-800">
                <Users className="h-12 w-12 mb-4 text-pink-600 dark:text-pink-400" />
                <h3 className="text-lg sm:text-xl font-bold text-pink-600 dark:text-pink-400">
                  Engage Your Fans
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Let your fans suggest and vote on songs to play next.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-purple-100 dark:bg-gray-800">
                <Radio className="h-12 w-12 mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                  Dynamic Playlist
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Watch as your stream's soundtrack evolves based on fan input.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 dark:bg-black/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                layout="responsive"
                width={100}
                height={100}
                alt="Streaming App Interface"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter sm:text-4xl text-purple-600 dark:text-purple-400">
                  Empower Your Fans
                </h2>
                <p className="max-w-[600px] text-gray-700 text-sm sm:text-base md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                  With FanTune, your audience isn't just listening - they're
                  part of the show. Let them suggest songs, vote on the next
                  track, and create a truly interactive streaming experience.
                </p>
                <Button className="w-full sm:w-fit bg-pink-600 hover:bg-pink-700 text-white dark:bg-pink-500 dark:hover:bg-pink-600">
                  Start Streaming Now
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white/50 backdrop-blur-sm dark:bg-gray-800/30 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl  font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-600 dark:text-purple-400">
                  Ready to Revolutionize Your Streams?
                </h2>
                <p className="max-w-[900px] text-gray-700 text-sm sm:text-base md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                  Join FanTune today and start creating unforgettable,
                  interactive music experiences with your audience.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    className="w-full sm:max-w-lg flex-1 bg-white dark:bg-gray-950 dark:text-white"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
                  >
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link
                    className="underline underline-offset-2 hover:text-purple-600 dark:hover:text-purple-400"
                    href="#"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          © 2024 FanTune. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:text-purple-600 dark:hover:text-purple-400"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:text-purple-600 dark:hover:text-purple-400"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
