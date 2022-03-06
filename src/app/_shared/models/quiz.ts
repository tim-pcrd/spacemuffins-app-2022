import { IUser } from "./user";

export interface IQuiz {
  id?: string;
  name: string;
  address: string;
  zipcode: number;
  city: string;
  date: any;
  numberOfPlayers: number;
  players?: {[key:string]: boolean};
  guests?: string[];
  remarks?: string;
  totalPoints?: number;
  fixedPoints?: number;
  variablePoints?: number;
  position?: number;
  totalTeams?: number;
  score?: number;
  maxScore?: number;
  link?: string;
  rating?: number;
}

export interface IDisplayQuiz extends IQuiz {
  currentPlayerPresent: boolean;
  corePlayersPresent: IUser[];
  corePlayersAbsent: IUser[];
  regularPlayersPresent: IUser[];
}
