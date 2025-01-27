import { Firestore, WriteBatch, collection, doc, writeBatch } from "firebase/firestore";

// Batch Write 함수
export const batchWrite = async (
  db: Firestore,
  collectionName: string,
  data: { [key: string]: any }[]
): Promise<void> => {
  try {
    // Firestore Batch 생성
    const batch: WriteBatch = writeBatch(db);

    // 데이터를 반복적으로 추가
    data.forEach((item) => {
      const docRef = doc(collection(db, collectionName), item.id);
      batch.set(docRef, item);
    });

    // 배치 커밋 실행
    await batch.commit();
    console.log("Batch write completed successfully!");
  } catch (error) {
    console.error("Batch write failed:", error);
  }
};