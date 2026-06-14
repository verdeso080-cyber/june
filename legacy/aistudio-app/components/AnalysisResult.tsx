import React, { useState, useEffect } from 'react';
import { StudySet, QuizQuestion } from '../types';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  SplitSquareHorizontal, 
  BrainCircuit,
  Library,
  Lightbulb,
  Columns,
  Maximize,
  PlusCircle,
  Loader2
} from 'lucide-react';

interface AnalysisResultProps {
  content: StudySet;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ content, onLoadMore, isLoadingMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'study' | 'quiz' | 'vocab'>('study');
  const [splitView, setSplitView] = useState(true); // Default to split view on large screens
  const [showOriginal, setShowOriginal] = useState(true); // For mobile/single view
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const totalUnits = content.items.length;
  const currentUnit = content.items[currentIndex];

  // Responsive check for split view default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSplitView(false);
      } else {
        setSplitView(true);
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset local state when unit changes
  useEffect(() => {
    setActiveTab('study');
    // Keep split view preference but reset content visibility for single view
    setShowOriginal(true);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < totalUnits - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnswerSelect = (qId: number, optionIndex: number) => {
    const key = `${currentUnit.id}-${qId}`;
    setSelectedAnswers(prev => ({ ...prev, [key]: optionIndex + 1 }));
    setShowExplanations(prev => ({ ...prev, [key]: true }));
  };

  if (!currentUnit) return <div className="text-center p-10">데이터가 없습니다.</div>;

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-fade-in px-4 md:px-6">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-2 bg-blue-50 w-fit px-3 py-1 rounded-full">
            <Library className="w-3 h-3" />
            <span>Keyword: {content.keyword} • {currentIndex + 1} of {content.totalFound} Found</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {currentUnit.source}
          </h2>
          <p className="text-slate-500 text-sm mt-2 flex items-center">
             <span className="font-semibold mr-2">선정 이유:</span> {currentUnit.relevanceReason}
          </p>
        </div>

        {/* Pagination */}
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 self-end lg:self-auto">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="p-3 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="px-4 font-mono font-medium text-slate-600 min-w-[80px] text-center">
            {currentIndex + 1} / {totalUnits}
          </div>
          <button 
            onClick={handleNext} 
            disabled={currentIndex === totalUnits - 1}
            className="p-3 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[700px]">
        
        {/* Sidebar Tabs */}
        <div className="lg:w-24 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-row lg:flex-col items-center justify-around lg:justify-start lg:py-8 gap-2 p-2 h-fit lg:h-auto lg:sticky lg:top-8 z-10">
          <TabButton 
            active={activeTab === 'study'} 
            onClick={() => setActiveTab('study')} 
            icon={<BookOpen className="w-6 h-6" />} 
            label="지문학습" 
          />
          <TabButton 
            active={activeTab === 'quiz'} 
            onClick={() => setActiveTab('quiz')} 
            icon={<BrainCircuit className="w-6 h-6" />} 
            label="실전퀴즈" 
          />
          <TabButton 
            active={activeTab === 'vocab'} 
            onClick={() => setActiveTab('vocab')} 
            icon={<Lightbulb className="w-6 h-6" />} 
            label="어휘장" 
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative">
          
          {/* VIEW: STUDY (READING) */}
          {activeTab === 'study' && (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Reading Mode</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSplitView(!splitView)}
                    className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-all shadow-sm"
                  >
                     {splitView ? <Maximize className="w-3 h-3"/> : <Columns className="w-3 h-3"/>}
                     <span>{splitView ? '크게 보기' : '비교 보기'}</span>
                  </button>
                  
                  {/* Mobile Toggle */}
                  <div className="lg:hidden flex bg-slate-200 rounded-lg p-1">
                    <button 
                      onClick={() => setShowOriginal(true)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${showOriginal ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                    >
                      원본
                    </button>
                    <button 
                      onClick={() => setShowOriginal(false)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!showOriginal ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                    >
                      AI 변형
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className={`flex flex-col lg:flex-row gap-8 h-full ${splitView ? '' : 'justify-center'}`}>
                  
                  {/* Original Text */}
                  {(splitView || showOriginal) && (
                    <div className={`flex-1 transition-all duration-300 ${splitView ? 'border-r border-slate-100 lg:pr-8' : ''}`}>
                      <div className="flex items-center mb-6">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide border border-slate-200">
                          Original Source (기출 원문)
                        </span>
                      </div>
                      <div className="prose prose-slate max-w-none text-lg leading-8 text-slate-700 font-serif">
                        {currentUnit.originalText}
                      </div>
                    </div>
                  )}

                  {/* Modified Text */}
                  {(splitView || !showOriginal) && (
                    <div className="flex-1 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide border border-indigo-100 flex items-center shadow-sm">
                          <PlusCircle className="w-3 h-3 mr-1.5" /> AI Modified (변형 지문)
                        </span>
                      </div>
                      <div className="prose prose-indigo max-w-none text-lg leading-8 text-slate-800 font-serif bg-indigo-50/30 p-6 rounded-xl border border-indigo-50/50">
                        {currentUnit.modifiedText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="flex flex-col h-full bg-slate-50">
               <div className="bg-white border-b border-slate-100 px-6 py-4">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center">
                   <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
                   실전 이해도 체크
                 </h3>
                 <p className="text-sm text-slate-500 ml-7">AI가 생성한 <span className="font-semibold text-primary">변형 지문</span>을 바탕으로 문제를 풀어보세요.</p>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 md:p-10">
                 <div className="max-w-3xl mx-auto space-y-8">
                  {currentUnit.questions.map((q, idx) => {
                    const qKey = `${currentUnit.id}-${q.id}`;
                    const selected = selectedAnswers[qKey];
                    const showExpl = showExplanations[qKey];
                    const isCorrect = selected === q.correctAnswer;

                    return (
                      <div key={idx} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide">
                              {q.type}
                            </span>
                          </div>
                          {showExpl && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isCorrect ? <CheckCircle2 className="w-3 h-3 mr-1"/> : <XCircle className="w-3 h-3 mr-1"/>}
                              {isCorrect ? '정답' : '오답'}
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
                          {q.questionText}
                        </h4>
                        
                        <div className="space-y-3">
                          {q.options.map((opt, optIdx) => {
                            const optNum = optIdx + 1;
                            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden ";
                            
                            if (showExpl) {
                              if (optNum === q.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-900";
                              else if (selected === optNum) btnClass += "border-red-400 bg-red-50 text-red-900";
                              else btnClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                            } else {
                              if (selected === optNum) btnClass += "border-primary bg-blue-50 text-primary font-medium shadow-inner";
                              else btnClass += "border-transparent bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm text-slate-700";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => !showExpl && handleAnswerSelect(q.id, optIdx)}
                                disabled={showExpl}
                                className={btnClass}
                              >
                                <span className="flex items-center z-10">
                                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs mr-3 transition-colors ${
                                    showExpl && optNum === q.correctAnswer ? 'border-green-600 bg-green-600 text-white' :
                                    selected === optNum ? 'border-primary bg-primary text-white' : 'border-slate-300 text-slate-400'
                                  }`}>
                                    {optNum}
                                  </span>
                                  {opt}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {showExpl && (
                          <div className="mt-6 pt-6 border-t border-slate-100 animate-slide-up">
                            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                              <div className="text-sm font-bold text-yellow-800 mb-2 flex items-center">
                                <Lightbulb className="w-4 h-4 mr-2" />
                                해설 가이드
                              </div>
                              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                 </div>
               </div>
            </div>
          )}

          {/* VIEW: VOCAB */}
          {activeTab === 'vocab' && (
            <div className="flex flex-col h-full">
              <div className="bg-slate-900 text-white px-6 py-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                   <BookOpen className="w-32 h-32" />
                </div>
                <h3 className="text-2xl font-bold flex items-center relative z-10">
                  <span className="bg-yellow-500 text-black w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-lg">V</span>
                  은영스쿨 어휘장
                </h3>
                <p className="text-slate-400 mt-2 relative z-10 max-w-xl">
                  이 지문에서 수능 1등급을 가르는 핵심 단어들입니다.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {currentUnit.vocabulary.map((v, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-center min-h-[120px]">
                      <span className="text-xl font-serif font-bold text-slate-800 group-hover:text-primary transition-colors mb-2">
                        {v.word}
                      </span>
                      <div className="w-12 h-1 bg-slate-100 group-hover:bg-primary/30 rounded-full mb-3 transition-colors"></div>
                      <span className="text-slate-500 font-medium text-sm">
                        {v.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Navigation / Load More */}
      <div className="mt-10 flex flex-col items-center justify-center space-y-4">
        {currentIndex < totalUnits - 1 ? (
          <button 
            onClick={handleNext}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1"
          >
            <span>다음 지문 공부하기</span>
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40"></div>
          </button>
        ) : (
          <div className="text-center animate-fade-in w-full max-w-md">
             <div className="inline-block p-4 rounded-full bg-green-100 text-green-800 mb-4">
               <CheckCircle2 className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">현재 학습 세트 완료!</h3>
             <p className="text-slate-500 mt-1 mb-6">준비된 모든 지문을 학습하셨습니다.</p>
             
             <button 
               onClick={onLoadMore}
               disabled={isLoadingMore}
               className={`
                 w-full flex items-center justify-center px-6 py-4 rounded-2xl border-2 font-bold text-lg transition-all
                 ${isLoadingMore 
                   ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed' 
                   : 'border-indigo-100 bg-white text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm hover:shadow-md'
                 }
               `}
             >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    새로운 지문 찾는 중...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 mr-2" />
                    관련 지문 더 찾아보기 (Load More)
                  </>
                )}
             </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

// UI Sub-components

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-3 rounded-xl w-full lg:w-20 transition-all duration-200
      ${active 
        ? 'text-primary bg-blue-50 shadow-inner scale-100 font-bold ring-1 ring-primary/10' 
        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }
    `}
  >
    <div className={`mb-1 ${active ? 'text-primary' : 'text-slate-400'}`}>{icon}</div>
    <span className="text-[10px] uppercase tracking-wider">{label}</span>
  </button>
);

export default AnalysisResult;