import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreQuestion, Question } from '../types';

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, orderBy('id'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreQuestion;
      return {
        ...data,
        answers: [],
        comments: []
      };
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export const fetchRandomQuestionByType = async (currentId: number, type: string): Promise<FirestoreQuestion | null> => {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef, 
      where('type', '==', type),
      where('id', '!=', currentId)
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