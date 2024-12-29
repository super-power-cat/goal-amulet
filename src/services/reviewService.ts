import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BasicQuestion, Result } from '../types';
import { generateUniqueId } from '../utils/idGenerator';

export const saveUserReview = async (questions: BasicQuestion[]): Promise<string> => {
  const resultId = generateUniqueId();
  
  try {
    const result: Result = {
      resultId,
      questions
    };
    
    await setDoc(doc(db, 'results', resultId), result);
    return resultId;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};

export const getUserReview = async (resultId: string): Promise<Result> => {
  try {
    const resultDoc = await getDoc(doc(db, 'results', resultId));
    if (!resultDoc.exists()) {
      throw new Error('Result not found');
    }
    return resultDoc.data() as Result;
  } catch (error) {
    console.error('Error fetching result:', error);
    throw error;
  }
};