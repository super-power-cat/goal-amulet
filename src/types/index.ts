export interface Answer {
  id: string;
  text: string;

}

export interface Question {
  id: number;
  content: string;
  answers: Answer[];
  isSingleAnswer: boolean; // 하나의 응답만 받는 질문일 경우
  isRefresh: boolean; // 질문을 새로 받을 수 있는 경우
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
  createdAt: string;
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

