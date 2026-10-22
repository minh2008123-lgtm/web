import { useState, useMemo } from 'react';
import {
  PenTool,
  Save,
  Send,
  FileCheck,
  Sparkles,
  BookOpen,
  Trash2,
  Clock,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../../components/ui';
import { writingPrompts } from '../../data/coursesData';
import { useLearning } from '../../hooks/useLearning';
import { evaluateWritingMetrics } from '../../lib/scoring';

export function WritingPractice() {
  const { writingDrafts, saveWritingDraft, deleteWritingDraft } = useLearning();

  const [selectedPromptId, setSelectedPromptId] = useState(writingPrompts[0].id);
  const currentPrompt =
    writingPrompts.find((p) => p.id === selectedPromptId) || writingPrompts[0];

  const existingDraft = writingDrafts.find((d) => d.promptId === currentPrompt.id);

  const [draftTitle, setDraftTitle] = useState(
    existingDraft?.title || `Bài viết: ${currentPrompt.title}`
  );
  const [content, setContent] = useState(existingDraft?.content || '');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    task: 20,
    coherence: 20,
    lexical: 20,
    grammar: 20,
  });
  const [submittedEvaluation, setSubmittedEvaluation] = useState(false);

  const handleSelectPrompt = (promptId: string) => {
    setSelectedPromptId(promptId);
    const prompt = writingPrompts.find((p) => p.id === promptId) || writingPrompts[0];
    const saved = writingDrafts.find((d) => d.promptId === promptId);
    setDraftTitle(saved?.title || `Bài viết: ${prompt.title}`);
    setContent(saved?.content || '');
    setShowModelAnswer(false);
    setSubmittedEvaluation(false);
  };

  const metrics = useMemo(
    () =>
      evaluateWritingMetrics(
        content,
        currentPrompt.minWords,
        currentPrompt.maxWords,
        currentPrompt.usefulPhrases.map((u) => u.phrase)
      ),
    [content, currentPrompt]
  );

  const handleInsertPhrase = (phrase: string) => {
    setContent((prev) => {
      const sep = prev.trim().length > 0 && !prev.endsWith(' ') ? ' ' : '';
      return `${prev}${sep}${phrase} `;
    });
  };

  const handleSaveDraft = () => {
    saveWritingDraft({
      id: existingDraft?.id || `draft-${Date.now()}`,
      promptId: currentPrompt.id,
      title: draftTitle || currentPrompt.title,
      content,
      wordCount: metrics.wordCount,
      status: 'draft',
    });
  };

  const handleSubmitWriting = () => {
    const selfTotal = Object.values(rubricScores).reduce((a, b) => a + b, 0);
    const combinedScore = Math.round(metrics.totalObjectiveScore * 0.5 + selfTotal * 0.5);

    saveWritingDraft({
      id: existingDraft?.id || `draft-${Date.now()}`,
      promptId: currentPrompt.id,
      title: draftTitle || currentPrompt.title,
      content,
      wordCount: metrics.wordCount,
      status: 'submitted',
      rubricScores,
      objectiveScore: metrics.totalObjectiveScore,
      totalScore: combinedScore,
    });
    setSubmittedEvaluation(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="text-emerald-600" size={26} />
            <h2 className="text-2xl font-bold text-gray-900">
              Luyện viết & Quản lý Bản nháp (Writing Studio)
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Soạn thảo theo đề bài CEFR, chèn nhanh cấu trúc gợi ý, lưu bản nháp tự động và đánh giá theo tiêu chí Rubric.
          </p>
        </div>
      </div>

      {/* Prompt Selector */}
      <div className="grid sm:grid-cols-2 gap-4">
        {writingPrompts.map((prompt) => {
          const active = prompt.id === currentPrompt.id;
          return (
            <button
              key={prompt.id}
              onClick={() => handleSelectPrompt(prompt.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={prompt.level === 'A1' ? 'success' : 'accent'}>
                  {prompt.level} • {prompt.category.toUpperCase()}
                </Badge>
                <span className="text-xs text-gray-500">
                  Yêu cầu: {prompt.minWords}–{prompt.maxWords} từ
                </span>
              </div>
              <h3 className="font-bold text-gray-900">{prompt.title}</h3>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Prompt, Outline & Useful Phrases (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <Badge variant="success">{currentPrompt.level} Writing Task</Badge>
            <h3 className="text-lg font-bold text-gray-900 mt-2">{currentPrompt.title}</h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              {currentPrompt.prompt}
            </p>

            {/* Outline */}
            <div className="mt-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
                <BookOpen size={15} className="text-emerald-600" />
                Gợi ý dàn ý (Outline)
              </h4>
              <ol className="space-y-1.5 text-xs text-gray-600 list-decimal list-inside">
                {currentPrompt.outlineSuggestions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Useful Phrases */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
                <Sparkles size={15} className="text-amber-500" />
                Cụm từ ăn điểm (Bấm để chèn vào trình soạn thảo)
              </h4>
              <div className="space-y-2">
                {currentPrompt.usefulPhrases.map((item) => {
                  const isUsed = metrics.usedPhrases.includes(item.phrase);
                  return (
                    <div
                      key={item.phrase}
                      onClick={() => handleInsertPhrase(item.phrase)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isUsed
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800">
                          + "{item.phrase}..."
                        </span>
                        {isUsed && (
                          <span className="text-[11px] text-emerald-600 font-medium">
                            ✓ Đã dùng
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-0.5">{item.meaning}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Saved Drafts List */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-gray-900">Bản nháp & Bài đã lưu ({writingDrafts.length})</h4>
              <Clock size={15} className="text-gray-400" />
            </div>

            {writingDrafts.length === 0 ? (
              <p className="text-xs text-gray-500">Chưa có bản nháp nào được lưu.</p>
            ) : (
              <div className="space-y-2.5">
                {writingDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-2"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        setSelectedPromptId(draft.promptId);
                        setDraftTitle(draft.title);
                        setContent(draft.content);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-xs text-gray-900 truncate">
                          {draft.title}
                        </p>
                        <Badge
                          variant={draft.status === 'submitted' ? 'success' : 'accent'}
                          size="sm"
                        >
                          {draft.status === 'submitted' ? 'Đã nộp' : 'Bản nháp'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {draft.wordCount} từ • Lưu lúc {draft.updatedAt}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteWritingDraft(draft.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                      title="Xóa bản nháp"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Editor, Live Metrics, Rubric & Model Answer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="font-bold text-gray-900 text-base border-b border-transparent focus:border-emerald-500 outline-none bg-transparent"
                placeholder="Tiêu đề bản nháp..."
              />
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2.5 py-1 rounded-full font-mono font-semibold ${
                    metrics.wordCount >= currentPrompt.minWords
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {metrics.wordCount} / {currentPrompt.minWords}–{currentPrompt.maxWords} từ
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {metrics.sentenceCount} câu
                </span>
              </div>
            </div>

            <textarea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết bài của bạn tại đây... Bạn có thể bấm vào các cụm từ gợi ý ở cột bên trái để chèn nhanh."
              className="input-field font-sans text-base leading-relaxed resize-y"
            />

            {/* Live Progress Bar for Word Count */}
            <div className="mt-3">
              <ProgressBar
                value={metrics.wordCount}
                max={currentPrompt.minWords}
                color={metrics.wordCount >= currentPrompt.minWords ? 'success' : 'primary'}
                size="sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleSaveDraft}>
                  <Save size={16} className="mr-1.5" />
                  Lưu bản nháp
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                >
                  <Eye size={16} className="mr-1.5" />
                  {showModelAnswer ? 'Ẩn bài mẫu' : 'Xem bài mẫu'}
                </Button>
              </div>

              <Button
                variant="success"
                onClick={handleSubmitWriting}
                disabled={metrics.wordCount < 10}
              >
                <Send size={16} className="mr-1.5" />
                Chấm điểm & Nộp bài (+45 XP)
              </Button>
            </div>
          </Card>

          {/* Self-Assessment Rubric & Objective Analysis */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileCheck size={19} className="text-emerald-600" />
                Đánh giá tiêu chí bài viết (Objective + Self-Rubric)
              </h3>
              <Badge variant="primary">
                Điểm tự động: {metrics.totalObjectiveScore}/100
              </Badge>
            </div>

            {metrics.suggestions.length > 0 && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">Gợi ý cải thiện tức thì:</p>
                {metrics.suggestions.map((s, idx) => (
                  <p key={idx}>• {s}</p>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {currentPrompt.rubric.map((crit) => (
                <div
                  key={crit.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-900 mb-1">
                    <span>{crit.name}</span>
                    <span className="text-emerald-700 font-mono">
                      {rubricScores[crit.id] || 20} / {crit.maxScore}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{crit.description}</p>
                  <input
                    type="range"
                    min={5}
                    max={crit.maxScore}
                    value={rubricScores[crit.id] || 20}
                    onChange={(e) =>
                      setRubricScores((prev) => ({
                        ...prev,
                        [crit.id]: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-emerald-600 h-1.5 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {submittedEvaluation && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={24} />
                <div className="text-xs text-emerald-900">
                  <p className="font-bold text-sm">
                    Đã lưu kết quả bài viết & cộng +45 XP vào kỹ năng Writing!
                  </p>
                  <p className="mt-0.5">
                    Điểm định lượng khách quan: {metrics.totalObjectiveScore}/100 • Cụm từ gợi ý đã áp dụng: {metrics.usedPhrases.length}/{currentPrompt.usefulPhrases.length}.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Model Answer Card */}
          {showModelAnswer && (
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-emerald-950">
                  Bài mẫu tham khảo (Model Answer - {currentPrompt.level})
                </h4>
                <Badge variant="success">Chuẩn CEFR</Badge>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-white p-4 rounded-xl border border-emerald-100 leading-relaxed">
                {currentPrompt.modelAnswer}
              </pre>
              <p className="text-xs text-emerald-800 mt-3 italic">
                💡 Phân tích: {currentPrompt.modelAnalysis}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
