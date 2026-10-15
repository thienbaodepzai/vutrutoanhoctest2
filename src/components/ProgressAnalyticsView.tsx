import React, { useState } from 'react';
import { useMathVerse } from '../context/MathVerseContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Target,
  Bot,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  RotateCcw,
  Trash2,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAIFeedbackStats, deleteAIFeedbackRecord, resetAIFeedbackData } from '../utils/aiFeedback';
import { formatMathNotation } from '../utils/formatMath';

export const ProgressAnalyticsView: React.FC = () => {
  const { user, setActiveTab } = useMathVerse();
  const aiStats = useAIFeedbackStats();
  const [filterRating, setFilterRating] = useState<'all' | 'wrong' | 'helpful'>('all');
  const [confirmResetAI, setConfirmResetAI] = useState(false);

  if (!user) return null;

  const totalAnswered = user.answeredQuestionsCount;
  const totalCorrect = user.correctAnswersCount;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Approximate study time: each answered question ~ 1.5 mins, each lesson ~ 10 mins
  const estimatedMins = Math.round(
    user.answeredQuestionsCount * 1.5 + user.completedLessons.length * 10
  );
  const estimatedHours = (estimatedMins / 60).toFixed(1);

  // Analyze topics
  const topicsData = Object.entries(user.topicStats).map(([topic, stats]) => {
    const rate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return {
      topic,
      correct: stats.correct,
      total: stats.total,
      rate,
    };
  });

  const strongTopics = topicsData.filter((t) => t.total >= 2 && t.rate >= 70);
  const weakTopics = topicsData.filter((t) => t.total >= 2 && t.rate < 60);

  // Filter feedback records
  const filteredRecords = aiStats.records.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const wrongRecords = aiStats.records.filter((r) => r.rating === 'wrong');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-cyan-400" />
          <span>Tiến độ & Báo cáo Năng lực Toán học</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Theo dõi chi tiết số liệu rèn luyện, tỉ lệ chính xác và kiểm định phản biện gia sư AI.
        </p>
      </div>

      {/* 4 Big Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tổng câu đã làm</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalAnswered}</div>
          <div className="text-[11px] text-slate-400">Đúng {totalCorrect} câu</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tỉ lệ chính xác</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {overallAccuracy}%
          </div>
          <div className="text-[11px] text-slate-400">
            {overallAccuracy >= 80 ? 'Xuất sắc' : overallAccuracy >= 60 ? 'Khá tốt' : 'Cần cố gắng'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tổng điểm XP</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-extrabold text-yellow-300 font-mono">{user.xp}</div>
          <div className="text-[11px] text-slate-400">Điểm kinh nghiệm</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Thời gian học</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">
            {estimatedHours}h
          </div>
          <div className="text-[11px] text-slate-400">Khoảng {estimatedMins} phút</div>
        </div>
      </div>

      {/* SECTION: AI BENCHMARK & AUDIT 2026 (Độ tin cậy & Thống kê phản biện MathBot AI) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
                <Bot className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Kiểm định & Phản biện MathBot AI</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
                  Chuẩn AI 2026
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hệ thống giám sát độ tin cậy và thu thập phản biện của học sinh để đánh giá và tối ưu hoá câu trả lời của gia sư AI.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('mathbot')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Thử nghiệm MathBot</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Yêu cầu thống kê:
            1. Tổng số câu trả lời AI
            2. Số lần AI bị báo sai
            3. Tỷ lệ báo sai (%)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Tổng số câu trả lời AI */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Tổng câu trả lời AI</span>
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {aiStats.totalAnswers}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 flex items-center gap-0.5">
                <ThumbsUp className="w-3 h-3" /> {aiStats.helpfulCount} hữu ích
              </span>
            </div>
          </div>

          {/* 2. Số lần AI bị báo sai */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Số lần bị báo sai</span>
              <ThumbsDown className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
              {aiStats.wrongCount}
            </div>
            <div className="text-[11px] text-slate-400">
              {aiStats.wrongCount === 0 ? 'Chưa ghi nhận lỗi' : 'Đã đưa vào dữ liệu phản biện'}
            </div>
          </div>

          {/* 3. Tỷ lệ báo sai (%) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Tỷ lệ báo sai (%)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                aiStats.wrongRate === 0
                  ? 'text-emerald-400'
                  : aiStats.wrongRate < 10
                  ? 'text-cyan-400'
                  : 'text-amber-400'
              }`}
            >
              {aiStats.wrongRate}%
            </div>
            <div className="text-[11px] text-slate-400">
              {aiStats.wrongRate === 0
                ? 'Độ chuẩn xác tuyệt đối (100%)'
                : `Độ tin cậy đạt ${(100 - aiStats.wrongRate).toFixed(1)}%`}
            </div>
          </div>
        </div>

        {/* Audit Log / History List */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Nhật ký phản hồi & phản biện từ người học
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
                {filteredRecords.length}
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterRating === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tất cả ({aiStats.records.length})
              </button>
              <button
                onClick={() => setFilterRating('wrong')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  filterRating === 'wrong'
                    ? 'bg-rose-950/80 text-rose-300 font-bold border border-rose-500/40'
                    : 'text-slate-400 hover:text-rose-300'
                }`}
              >
                <ThumbsDown className="w-3 h-3" />
                <span>Bị báo sai ({wrongRecords.length})</span>
              </button>
              <button
                onClick={() => setFilterRating('helpful')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  filterRating === 'helpful'
                    ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Hữu ích ({aiStats.helpfulCount})</span>
              </button>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto text-xl">
                📝
              </div>
              <p className="text-sm font-semibold text-slate-300">
                {filterRating === 'wrong'
                  ? 'Chưa có câu trả lời nào bị báo sai!'
                  : 'Chưa có dữ liệu phản hồi nào được ghi nhận.'}
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Khi học sinh trò chuyện với MathBot và bấm vào các nút "👍 Hữu ích" hoặc "👎 AI sai rồi", toàn bộ dữ liệu phản biện sẽ được cập nhật tại đây theo thời gian thực.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredRecords.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.rating === 'wrong'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-emerald-950/20 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          item.rating === 'wrong'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {item.rating === 'wrong' ? (
                          <>
                            <ThumbsDown className="w-3 h-3" /> AI sai rồi
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="w-3 h-3" /> Hữu ích
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteAIFeedbackRecord(item.id)}
                      title="Xóa bản ghi này"
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Nội dung câu hỏi */}
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-300">
                      <span className="font-bold text-cyan-300">Câu hỏi: </span>
                      <span className="italic">{item.question}</span>
                    </div>

                    {/* Câu trả lời AI */}
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-300 mt-1 max-h-32 overflow-y-auto font-sans leading-relaxed whitespace-pre-wrap">
                      <div className="text-[10px] uppercase font-bold text-indigo-400 mb-0.5">
                        Câu trả lời AI:
                      </div>
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reset feedback logs option */}
          {aiStats.records.length > 0 && (
            <div className="pt-2 flex justify-end">
              {!confirmResetAI ? (
                <button
                  type="button"
                  onClick={() => setConfirmResetAI(true)}
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Đặt lại dữ liệu phản biện AI
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-rose-300">Xác nhận xóa toàn bộ nhật ký phản biện?</span>
                  <button
                    onClick={() => {
                      resetAIFeedbackData();
                      setConfirmResetAI(false);
                    }}
                    className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold cursor-pointer"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => setConfirmResetAI(false)}
                    className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Topic Accuracy Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Tỉ lệ chính xác theo từng phân môn</span>
          </h3>
          <span className="text-xs text-slate-400">Cập nhật theo thời gian thực</span>
        </div>

        <div className="space-y-4">
          {topicsData.map((t) => (
            <div key={t.topic} className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-200">{t.topic}</span>
                <span className="font-mono text-cyan-300">
                  {t.rate}% ({t.correct}/{t.total} câu)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    t.rate >= 70
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : t.rate >= 50
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-500 to-pink-500'
                  }`}
                  style={{ width: `${t.rate || (t.total === 0 ? 0 : 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strong Topics */}
        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>Chủ đề thế mạnh của em</span>
          </div>
          {strongTopics.length > 0 ? (
            <div className="space-y-2">
              {strongTopics.map((st) => (
                <div
                  key={st.topic}
                  className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex justify-between text-xs"
                >
                  <span className="font-bold text-white">{st.topic}</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {st.rate}% đúng ({st.correct}/{st.total})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 leading-relaxed">
              Làm thêm từ 2-3 câu hỏi để hệ thống xác định những chủ đề mà em vượt trội nhất nhé!
            </p>
          )}
        </div>

        {/* Weak Topics */}
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Chủ đề cần cải thiện</span>
          </div>
          {weakTopics.length > 0 ? (
            <div className="space-y-2">
              {weakTopics.map((wt) => (
                <div
                  key={wt.topic}
                  className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 flex justify-between text-xs"
                >
                  <span className="font-bold text-white">{wt.topic}</span>
                  <span className="text-rose-400 font-mono font-bold">
                    {wt.rate}% đúng ({wt.correct}/{wt.total})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 leading-relaxed">
              Không có chủ đề nào bị đánh giá yếu! Em đang duy trì phong độ làm bài rất đều và tốt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
