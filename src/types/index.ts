export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}