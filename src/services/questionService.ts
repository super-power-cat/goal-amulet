import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreQuestion, Question } from '../types';

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      where('isDefault', '==', true),
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