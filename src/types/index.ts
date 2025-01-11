import { Timestamp } from "firebase/firestore";

// Add ColorOption type
export type ColorOption = 'LUCK' | 'POWER' | 'FIRE';

export type ColorInfo = {
  file: string;
  title: string;
  code: string;
};

export const Colors = {
  LUCK: {
    file: "luck_amulet.svg",
    title: "행운 부적",
    code: "#9fffaa",
  },
  POWER: {
    file: "yellow_amulet_2.svg",
    title: "파워 부적",
    code: "#FFFF9F",
  },
  FIRE: {
    file: "yellow_amulet_2.svg",
    title: "열정 부적",
    code: "#ffbc9f",
  },
} as const;

// Type-safe access to Colors
export type ColorKey = keyof typeof Colors;

export const getColorInfo = (color: ColorKey): ColorInfo => Colors[color];

export interface Answer {
  id: string;
  text: string;

}

export interface Question {
  id: number;
  content: string;
  type: string;
  answers: Answer[];
  isSingleAnswer: boolean; // 하나의 응답만 받는 질문일 경우
  isRefresh: boolean; // 질문을 새로 받을 수 있는 경우
  comments: Comment[];
}
export interface BasicQuestion {
  id: number;
  content: string;
  answers: Answer[];
  comments: Comment[];
}

export interface FirestoreQuestion {
  id: number;
  content: string;
  type: string;
  isSingleAnswer: boolean;
  isRefresh: boolean;
}


export interface Result {
  resultId: string;
  questions: BasicQuestion[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Timestamp;
  resultId: string;
  questionId: number;
}

export interface ReflectionResponse {
  questionId: number;
  questionText: string;
  answers: Answer[];
  comments: Comment[];
}

export interface Review {
  id: string;
  responses: ReflectionResponse[];
  createdAt: string;
}

