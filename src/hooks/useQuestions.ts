import { useState, useEffect } from 'react';
import { Question } from '../types';
import { fetchQuestions } from '../services/questionService';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
        setError(null);
      } catch (err) {
        setError('질문을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  return { questions, loading, error };
}