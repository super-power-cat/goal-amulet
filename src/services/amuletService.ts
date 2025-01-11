import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ColorKey } from '../types';
import { generateUniqueId } from '../utils/idGenerator';

interface AmuletData {
  id: string;
  color: ColorKey;
  text: string;
  createdAt: Date;
  isShared: boolean;
}

export const saveAmulet = async (color: ColorKey, text: string): Promise<string> => {
  const amuletId = generateUniqueId();
  
  const amuletData: AmuletData = {
    id: amuletId,
    color,
    text,
    createdAt: new Date(),
    isShared: false
  };
  
  await setDoc(doc(db, 'amulets', amuletId), amuletData);
  return amuletId;
};

export const getAmulet = async (amuletId: string): Promise<AmuletData | null> => {
  const docRef = doc(db, 'amulets', amuletId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as AmuletData;
  }
  return null;
};

export const updateAmuletColor = async (amuletId: string, color: ColorKey): Promise<void> => {
  const docRef = doc(db, 'amulets', amuletId);
  await setDoc(docRef, { color: color }, { merge: true });
};

export const updateAmuletText = async (amuletId: string, text: string): Promise<void> => {
  const docRef = doc(db, 'amulets', amuletId);
  await setDoc(docRef, { text }, { merge: true });
};