export interface IUser {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  streams: IStream[];
  isAlive: boolean;
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
  _id: string;
  externalId: string;
  title: string;
  coverImageUrl: string;
  source: StreamTypes;
  vote: string[];
  artist: string;
  noOfVote: number;
  stream: IStream;
}
