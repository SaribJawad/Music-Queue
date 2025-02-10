export interface IUser {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  streams: IStream[];
  createdAt: Date;
  updatedAt: Date;
}

type StreamTypes = "youtube" | "soundcloud";

export interface IStream {
  _id: string;
  streamType: StreamTypes;
  owner: IUser;
  songQueue: ISong[];
  currentSong: ISong;
}

export interface ISong {
  externalId: string;
  title: string;
  duration: number;
  coverImageUrl: string;
  source: StreamTypes;
  vote: string[];
  noOFVote: number;
  stream: IStream;
}
