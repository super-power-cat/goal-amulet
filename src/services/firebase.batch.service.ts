// services/firestoreBatchService.ts
import { db } from '../config/firebase'; // Firebase 초기화 파일에서 가져옴
import { writeBatch, doc } from 'firebase/firestore';

type FirestoreData = {
  id: string; // 문서 ID
  [key: string]: any; // 문서 데이터
};

/**
 * Firestore 배치 쓰기 함수
 * @param collectionPath Firestore 컬렉션 경로
 * @param dataArray 추가할 데이터 배열
 */
export async function batchWrite(
  collectionPath: string,
  dataArray: FirestoreData[]
): Promise<void> {
  if (!dataArray || dataArray.length === 0) {
    console.warn('No data provided for batch write.');
    return;
  }

  const batch = writeBatch(db);

  dataArray.forEach((data) => {
    const docRef = doc(db, collectionPath, data.id); // 컬렉션 경로와 ID로 문서 참조 생성
    const { id, ...docData } = data; // id를 제외한 나머지 데이터
    batch.set(docRef, docData); // 배치에 set 작업 추가
  });

  try {
    await batch.commit();
    console.log('Batch write completed successfully!');
  } catch (error) {
    console.error('Error in batch write:', error);
  }
}
