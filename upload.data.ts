import { batchWrite } from './src/services/firebase.batch.service';

const data = [
  
  { id: '1', content: 'What is your name?', isDefault: true, type : "Q_1", isSingleAnswer: true, isRefresh: false },
  { id: '2', question: 'How old are you?', isDefault: true },
];

(async () => {
  await batchWrite('questions', data);
})();
