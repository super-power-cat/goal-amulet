import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreQuestion, NewQuestion, Question } from '../types';

export const fetchQuestions= async (): Promise<NewQuestion[]> => {
  const question: NewQuestion[] = [
    {
    id: 1,
    content: '이름이 어떻게 되세요?',
    type: 'NAME',
    answers: [],
    limitAnswer: 1,
    tip: '별명을 적어주셔도 좋아요. '
  },
  {
    id: 2,
    content: '달성하고 싶은 목표가 있으신가요?',
    type: 'YN',
    answers: [],
    limitAnswer: 1,
    tip: '있으시다면 네를, 아니라면 아니요를 눌러주세요.'
  },
  {
    id: 3,
    content: '달성하고 싶은 목표를 최대 세 가지 알려주세요!',
    type: 'GOAL-1',
    answers: [],
    limitAnswer: 3,
    tip: '간단한 목표여도 좋아요. 무엇을 이루고 싶나요? 부적을 만들고도 목표를 수정할 수 있으니 편하게 적어주세요.'
  },
  {
    id: 4,
    content: '좋아요, 저랑 함께 정해봐요! 요즘 관심을 두고 있는 주제나 활동이 있는지 궁금해요.',
    type: 'QUESTION',
    answers: [],
    limitAnswer: 10,
    tip: '더 잘 하고 싶거나, 배워보고 싶은 활동 모두 상관 없어요. 최대한 많이 적어볼까요?'
  },
  {
    id: 5,
    content: '관심있는 분야를 발전시키기 위해서는 무엇을 할 수 있을까요?',
    type: 'QUESTION',
    answers: [],
    limitAnswer: 3,
    tip: '아주 작은 것이라도 괜찮아요. <br/>예를 들어 배우고 싶은 게 있다면 학원을 등록할 수도, 교재를 살 수도 있을 거예요. 한 번 고민해서 적어볼까요?'
  },
  {
    id: 6,
    content: '지금의 자신에게 해주고 싶은 조언이 잇다면 무엇일까요?',
    type: 'QUESTION',
    answers: [],
    limitAnswer: 3,
    tip: '스스로 해주고 싶은 말을 생각해보면서 내가 무엇이 부족한지, 스스로 어떤 사람이 되고 싶은지 생각해 볼 수 있어요. <br/>간단한 말이라도 좋으니 적어봐요.'
  },
  {
    id: 7,
    content: '수고하셨어요! 이제 위에서 답변한 내용을 토대로, 달성하고 싶은 목표를 정해볼까요?',
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