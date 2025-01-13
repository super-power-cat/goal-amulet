import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreQuestion, NewQuestion, Question } from '../types';

export const fetchQuestions= async (): Promise<NewQuestion[]> => {
  const question: NewQuestion[] = [
    {
    id: 1,
    content: '이름이 어떻게 되세요?',
    type: 'YN',
    answers: [],
    limitAnswer: 1,
    tip: '별명을 적어주셔도 좋아요. '
  },
  {
    id: 2,
    content: '25년 목표 정하셨나요?',
    type: 'QUESTION',
    answers: [],
    limitAnswer: 1,
    tip: '적어주셨다면 네를, 아니라면 아니오를 눌러주세요.'
  },
  {
    id: 4,
    content: '25년 목표를 최대 세 가지 알려주세요!',
    type: 'GOAL-1',
    answers: [],
    limitAnswer: 3,
    tip: '간단한 목표여도 좋아요. 무엇을 이루고 싶나요? 부적을 만들고도 목표를 수정할 수 있으니 편하게 적어주세요.'
  },
  {
    id: 3,
    content: '좋아요, 저랑 함께 정해봐요! \n 24년 가장 성장했던 부분이 뭐였나요?',
    type: 'QUESTION',
    answers: [],
    limitAnswer: 1,
    tip: '성장했던 부분을 알려주세요.'
  },
  {
    id: 5,
    content: '위의 답변을 토대로 한 번 생각해봐요. 25년, 무엇을 이루고 싶나요?',
    type: 'GOAL-2',
    answers: [],
    limitAnswer: 3, 
    tip: '최대 세 가지를 입력할 수 있어요. 부적을 만들고도 목표를 수정할 수 있으니 편하게 적어주세요.'
  },  
];

  return question;
  
};

export const fetchQuestionsByFirebase = async (): Promise<Question[]> => {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      // where('isDefault', '==', true),
      // orderBy('type') // Firestore에서 먼저 정렬
    );
    const querySnapshot = await getDocs(q);
    
    const questions = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreQuestion;
      return {
        ...data,
        answers: [],
        comments: []
      };
    });

    // 코드에서 한 번 더 type으로 정렬
    questions.sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    });

    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};


export const fetchRandomQuestionByType = async (qId: number, type: string): Promise<FirestoreQuestion | null> => {
  try {
    const q = query(
      collection(db, 'questions'),
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    const questions = querySnapshot.docs.map(doc => doc.data() as FirestoreQuestion);

    if (questions.length === 0) return null;

    // 최대 3번까지 시도
    let attempts = 0;
    let selectedQuestion: FirestoreQuestion;

    do {
      const randomIndex = Math.floor(Math.random() * questions.length);
      selectedQuestion = questions[randomIndex];
      attempts++;

      // 다른 질문을 찾았거나, 최대 시도 횟수에 도달한 경우 종료
      if (selectedQuestion.id !== qId || attempts >= 3) {
        break;
      }
    } while (true);

    // 3번 시도 후에도 같은 질문이 선택된 경우
    if (selectedQuestion.id === qId) {
      return selectedQuestion;
    }

    return selectedQuestion;
  } catch (error) {
    console.error('Error fetching random question:', error);
    throw error;
  }
};