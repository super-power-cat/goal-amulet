export interface Answer {
  id: string;
  text: string;

}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  isSingleAnswer: boolean; // 하나의 응답만 받는 질문일 경우
  isRefresh: boolean; // 질문을 새로 받을 수 있는 경우
}