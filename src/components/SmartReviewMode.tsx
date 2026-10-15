import React, { useState } from 'react';
import { useMathVerse } from '../context/MathVerseContext';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { QUESTIONS_DATA } from '../data/questionsData';
import {
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export const SmartReviewMode: React.FC = () => {
  const { user, setActiveTab, setSelectedLessonId, recordQuestionResult } = useMathVerse();
  const mistakes = user?.recentMistakes || [];

  // Active retry state
  const [retryQuestionId, setRetryQuestionId] = useState<string | null>(null);
  const [retryInput, setRetryInput] = useState<string>('');
  const [retryFeedback, setRetryFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Group mistakes by topic
  const topicCounts: Record<string, number> = {};
  mistakes.forEach((m) => {
    topicCounts[m.topic] = (topicCounts[m.topic] || 0) + 1;
  });

  const topWeakTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);

  // Recommend lessons based on weak topics
  const recommendedLessons = CURRICULUM_DATA.filter((l) =>
    topWeakTopics.includes(l.topic)
  ).slice(0, 3);

  const handleStartRetry = (qId: string) => {
    soundManager.playClickSound();
    setRetryQuestionId(qId);
    setRetryInput('');
    setRetryFeedback(null);
  };

  const handleRetrySubmit = (qId: string, correctAnswer: string, explanation: string, topic: string) => {
    const qObj = QUESTIONS_DATA.find((q) => q.id === qId);
    const cleanInput = retryInput.trim().replace(',', '.');
    const cleanTarget = correctAnswer.trim().replace(',', '.');
    const isCorrect = cleanInput === cleanTarget || (parseFloat(cleanInput) === parseFloat(cleanTarget));

    if (isCorrect) {
      soundManager.playCorrectSound();
      soundManager.triggerConfetti();
      setRetryFeedback({
        isCorrect: true,
        message: 'Chính xác! Em đã khắc phục được lỗi sai này xuất sắc! 🎉',
      });
      recordQuestionResult(
        qId,
        true,
        topic,
        qObj?.question || '',
        retryInput,
        correctAnswer,
        explanation,
        25
      );
    } else {
      soundManager.playWrongSound();
      setRetryFeedback({
        isCorrect: false,
        message: 'Vẫn chưa đúng. Hãy xem lại hướng dẫn bên dưới nhé!',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <RotateCcw className="w-7 h-7 text-violet-400" />
          <span>Ôn tập thông minh (Smart Review)</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Hệ thống tự động phát hiện những câu hỏi hoặc chủ đề em còn lúng túng để giúp em khắc phục triệt để.
        </p>
      </div>

      {/* Diagnosis & Recommendations Banner */}
      {topWeakTopics.length > 0 ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/70 border border-violet-500/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span>Chẩn đoán năng lực học tập của em:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Chủ đề thường gặp sai sót:</div>
              <div className="text-base font-bold text-amber-300">
                {topWeakTopics.join(', ')}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Em có {mistakes.length} câu hỏi cần được ôn lại.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Kế hoạch cải thiện đề xuất:</div>
              <div className="text-sm font-semibold text-cyan-300">
                • Ôn lại lý thuyết 15 phút
              </div>
              <div className="text-sm font-semibold text-emerald-300">
                • Làm lại {Math.min(mistakes.length, 5)} câu đã sai dưới đây
              </div>
            </div>
          </div>

          {/* Recommended Lessons */}
          {recommendedLessons.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Bài học được gợi ý nên ôn lại:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedLessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setSelectedLessonId(l.id);
                      setActiveTab('lessons');
                      soundManager.playClickSound();
                    }}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-violet-400 text-left transition-colors cursor-pointer group flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <div className="text-[11px] text-violet-300 font-bold">{l.topic}</div>
                      <div className="text-xs font-bold text-white truncate">{l.title}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-bold text-white">Chưa ghi nhận câu hỏi sai nào!</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Em đang học tập rất xuất sắc hoặc chưa làm nhiều câu hỏi. Hãy qua mục Luyện tập hoặc Trắc nghiệm để thử sức ngay nhé!
          </p>
          <button
            onClick={() => setActiveTab('practice')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm cursor-pointer"
          >
            Bắt đầu luyện tập ngay
          </button>
        </div>
      )}

      {/* List of Mistake Cards */}
      {mistakes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Danh sách các câu đã làm sai ({mistakes.length} câu)</span>
            </h2>
            <span className="text-xs text-slate-400">Bấm &quot;Làm lại câu này&quot; để xóa khỏi danh sách</span>
          </div>

          <div className="space-y-3">
            {mistakes.map((m, idx) => {
              const isRetrying = retryQuestionId === m.questionId;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        {m.topic}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug">
                        {m.questionText}
                      </h4>
                    </div>

                    {!isRetrying && (
                      <button
                        onClick={() => handleStartRetry(m.questionId)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-400/40 text-cyan-300 hover:text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                      >
                        Làm lại câu này
                      </button>
                    )}
                  </div>

                  {/* Previous Answer Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300">
                      <strong>Câu trả lời trước của em:</strong> {m.userAnswer}
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                      <strong>Đáp án chính xác:</strong> {m.correctAnswer}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 leading-relaxed border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">💡 Hướng dẫn giải chi tiết:</strong>
                    <div className="whitespace-pre-line">{m.explanation}</div>
                  </div>

                  {/* Interactive Retry Input */}
                  {isRetrying && (
                    <div className="pt-2 border-t border-slate-800 space-y-3 animate-in fade-in">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={retryInput}
                          onChange={(e) => setRetryInput(e.target.value)}
                          placeholder="Nhập lại đáp án đúng sau khi đã xem hướng dẫn..."
                          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            handleRetrySubmit(
                              m.questionId,
                              m.correctAnswer,
                              m.explanation,
                              m.topic
                            )
                          }
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                        >
                          Xác nhận
                        </button>
                      </div>

                      {retryFeedback && (
                        <div
                          className={`p-3 rounded-xl text-xs font-semibold ${
                            retryFeedback.isCorrect
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950/40 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {retryFeedback.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
