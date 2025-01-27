import { db } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

export const addCheer = async (amuletId: string) => {
  try {
    await addDoc(collection(db, 'cheers'), {
      amuletId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error adding cheer:', error);
    throw error;
  }
};

export const addCheerMessage = async (amuletId: string, message: string) => {
  try {
    await addDoc(collection(db, 'cheerMessages'), {
      amuletId,
      message,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error adding cheer message:', error);
    throw error;
  }
}; 