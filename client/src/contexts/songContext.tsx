import { createContext, useContext } from "react";

interface SongContextType {
  addSong(url: string): void;
}

export const SongContext = createContext<SongContextType | null>(null);

export const SongContextProvder = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  function addSong(url: string) {
    // send url to backend handle there
  }

  return (
    <SongContext.Provider value={{ addSong }}>{children}</SongContext.Provider>
  );
};

export const useSongContext = () => {
  const context = useContext(SongContext);
  if (!context) throw new Error("useSongContext must be user within provider");
  return context;
};
