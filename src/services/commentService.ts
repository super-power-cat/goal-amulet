import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Comment } from '../types';

export const saveComment = async (
  resultId: string,
  questionId: number,
  text: string,
  author: string
): Promise<Comment> => {
  try {
    const comment: Omit<Comment, 'id'> = {
      resultId,
      questionId,
      text,
      author,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'comments'), comment);
    
    return {
      id: docRef.id,
      ...comment,
    };
  } catch (error) {
    console.error('Error saving comment:', error);
    throw error;
  }
};

export const getComments = async (resultId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('resultId', '==', resultId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};