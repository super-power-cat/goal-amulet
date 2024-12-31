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


export const fetchRandomQuestionByType = async (type: string): Promise<FirestoreQuestion | null> => {
  try {
    const q = query(
      collection(db, 'questions'),
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    const questions = querySnapshot.docs.map(doc => doc.data() as FirestoreQuestion);

    if (questions.length === 0) return null;
    
    // 랜덤하게 하나의 질문 선택
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  } catch (error) {
    console.error('Error fetching random question:', error);
    throw error;
  }
};