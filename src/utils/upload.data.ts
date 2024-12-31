import React from "react";
import { getFirestore } from "firebase/firestore";
import { batchWrite } from "../services/firebase.batch.service"; // 배치 서비스 파일 가져오기

const UploadData = () => {
  const db = getFirestore(); // Firestore 인스턴스 가져오기

  const data = [
    { id: '1', content: '이름이 뭐야?', isDefault: true, type: "Q_1", isSingleAnswer: true, isRefresh: false },
    { id: '2', content: '올 한 해는 어땠어?', isDefault: true, type: "Q_2", isSingleAnswer: true, isRefresh: true },
    { id: '3', content: '24년 몇 월이 가장 행복했어?', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },
    { id: '4', content: '기억에 남는 하루가 있어?', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },
    { id: '5', content: '24년 가장 인상 깊었던 여행지는 어디였어?', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },
    { id: '6', content: '24년에 새롭게 알게 된 사람이 있어?', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },
    { id: '7', content: '24년 동안 더더욱 친해진 사람이 있어?', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },
    { id: '8', content: '24년에 관계에서 특히 노력한 것이 있어?', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },
    { id: '9', content: '24년에 가장 맛있었던 음식은 뭐야? 설명해줘!', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },
    { id: '10', content: '무언갈 먹으며 가장 행복했던 기억이 뭐야?', isDefault: false, type: "Q_2", isSingleAnswer: false, isRefresh: true },

    { id: '11', content: '여행 중 가장 기억에 남는 순간이 뭐야?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '12', content: '계획하지 않았던 즉흥적인 행동이 있었어?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '13', content: '여행을 통해 새롭게 배운 게 뭐야?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '14', content: '가장 많은 시간을 함께 보낸 사람은 누구야?', isDefault: true, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '15', content: '앞으로 더 친해지고 싶은 사람은 누구야?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '16', content: '주변인들에게 전하고 싶은 말이 있어?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '17', content: '24년에 받은 선물 중 가장 기억에 남는 건 뭐야?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '18', content: '처음 먹어봤던 음식이 있어?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '19', content: '가장 좋았던 음식점을 추천해줄래?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },
    { id: '20', content: '꼭 먹고 싶었는데 못 먹은 음식이 있어?', isDefault: false, type: "Q_3", isSingleAnswer: false, isRefresh: true },


    { id: '21', content: '처음 도전해 본 일이 있어? 어땠어?', isDefault: false, type: "Q_4", isSingleAnswer: false, isRefresh: true },
    { id: '22', content: '시도 했지만 실패했던 일이 있어? 무엇을 느꼈어?', isDefault: false, type: "Q_4", isSingleAnswer: false, isRefresh: true },
    { id: '23', content: '새롭게 배운 기술이나 취미가 있어?', isDefault: true, type: "Q_4", isSingleAnswer: false, isRefresh: true },
    { id: '24', content: '새로운 기술이나 취미를 배우게 된 계기가 뭐였어?', isDefault: false, type: "Q_4", isSingleAnswer: false, isRefresh: true },
    { id: '25', content: '가장 큰 성취감을 느꼈을 때가 언제였어?', isDefault: false, type: "Q_4", isSingleAnswer: false, isRefresh: true },
    { id: '26', content: '가장 큰 배움이 뭐였어?', isDefault: false, type: "Q_4", isSingleAnswer: false, isRefresh: true },

    { id: '27', content: '24년 목표 중 달성한 것이 있어?', isDefault: false, type: "Q_5", isSingleAnswer: false, isRefresh: true },
    { id: '28', content: '24년 목표를 이루면서 배운 점이 있어?', isDefault: false, type: "Q_5", isSingleAnswer: false, isRefresh: true },
    // { id: '29', content: '내년에 새우고 싶은 목표가 뭐야?', isDefault: false, type: "Q_5", isSingleAnswer: false, isRefresh: true },
    { id: '30', content: '목표를 이루며 기억에 남는 순간이 있어?', isDefault: false, type: "Q_5", isSingleAnswer: false, isRefresh: true },
    { id: '31', content: '24년 목표가 뭐였어?', isDefault: true, type: "Q_5", isSingleAnswer: false, isRefresh: true },
    { id: '32', content: '스스로를 칭찬해줘!', isDefault: false, type: "Q_5", isSingleAnswer: false, isRefresh: true },
    { id: '33', content: '24년의 너를 한 마디로 표현해줘!', isDefault: false, type: "Q_5", isSingleAnswer: true, isRefresh: true },
    { id: '34', content: '24년은 어떤 색깔이었어?', isDefault: false, type: "Q_5", isSingleAnswer: true, isRefresh: true },
    { id: '35', content: '24년을 한 문장으로 표현해줘!', isDefault: false, type: "Q_5", isSingleAnswer: true, isRefresh: true },

    { id: '36', content: '다음년도 목표를 공유해줘!', isDefault: false, type: "Q_6", isSingleAnswer: false, isRefresh: true },
    { id: '37', content: '다음년도에 배우고 싶은 게 있어?', isDefault: false, type: "Q_6", isSingleAnswer: false, isRefresh: true },
    { id: '38', content: '다음년도 꼭 가고 싶은 곳 있어?', isDefault: false, type: "Q_6", isSingleAnswer: false, isRefresh: true },
    { id: '39', content: '다음년도 친구들에게 한마디 해줘!', isDefault: true, type: "Q_6", isSingleAnswer: false, isRefresh: true }
  ];
  
  

  const uploadData = async () => {
    await batchWrite(db, "questions", data);
  };

  uploadData();
};

export default UploadData;