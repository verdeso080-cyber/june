import React, { useState } from 'react';
import SearchInput from './components/SearchInput';
import AnalysisResult from './components/AnalysisResult';
import { AnalysisState, StudySet } from './types';
import { analyzeText } from './services/geminiService';
import { BookOpen, Sparkles, RefreshCcw, Layers, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  // Step 0: Search, 1: Loading, 2: Result
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSearch = async (keyword: string) => {
    setStep(1); // Move to loading
    setAnalysisState({ isLoading: true, result: null, error: null });

    try {
      const result = await analyzeText(keyword);
      // Validate result has items
      if (!result.items || result.items.length === 0) {
        throw new Error("관련된 지문을 찾을 수 없습니다. 더 넓은 범위의 주제어로 검색해보세요.");
      }
      setAnalysisState({
        isLoading: false,
        result: result,
        error: null,
      });
      setStep(2); // Move to result
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
      setStep(0); // Reset on error
    }
  };

  const handleLoadMore = async () => {
    if (!analysisState.result) return;
    
    setLoadingMore(true);
    const currentSources = analysisState.result.items.map(item => item.source);
    const keyword = analysisState.result.keyword;

    try {
      const newBatch = await analyzeText(keyword, currentSources);
      
      if (!newBatch.items || newBatch.items.length === 0) {
        alert("더 이상 새로운 관련 지문이 없습니다.");
        setLoadingMore(false);
        return;
      }

      // Merge new items with existing result
      setAnalysisState(prev => {
        if (!prev.result) return prev;
        return {
          ...prev,
          result: {
            ...prev.result,
            totalFound: prev.result.totalFound + newBatch.items.length,
            items: [...prev.result.items, ...newBatch.items]
          }
        };
      });
    } catch (error) {
      console.error("Failed to load more:", error);
      alert("추가 지문을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnalysisState({ isLoading: false, result: null, error: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full p-6 flex justify-between items-center z-50 transition-all duration-300 ${step === 2 ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center space-x-3 text-slate-800 font-bold text-xl cursor-pointer group" onClick={handleReset}>
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="tracking-tight text-xl">은영<span className="text-primary font-serif font-black italic">스쿨</span></span>
        </div>
        {step === 2 && (
          <button 
            onClick={handleReset}
            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all text-sm font-bold"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>새 검색</span>
          </button>
        )}
      </nav>

      <main className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center pt-20">
        
        {/* VIEW 1: SEARCH (HERO) */}
        {step === 0 && (
          <div className="w-full max-w-5xl text-center space-y-10 animate-fade-in pb-20">
            
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide border border-indigo-100 shadow-sm">
                <Sparkles className="w-3 h-3 mr-1.5" />
                2025 수능 영어 AI 엔진 v2.0
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1]">
                기출을 넘어서,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                  은영스쿨 AI와 함께.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed break-keep">
                수능 영어, 단순 기출 반복으로는 부족합니다.<br className="hidden md:block"/>
                AI가 엄선한 기출 지문과 고퀄리티 변형 문제로 실전 감각을 완성하세요.
              </p>
            </div>
            
            <div className="mt-12">
              <SearchInput 
                onSearch={handleSearch} 
                isLoading={false}
                disabled={false}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-16">
              {[
                { 
                  icon: <Layers className="w-6 h-6 text-blue-600" />,
                  title: "심층 기출 분석", 
                  desc: "빅데이터를 통해 주제별 가장 적합한 기출 지문을 찾아냅니다." 
                },
                { 
                  icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
                  title: "실전 변형 문제", 
                  desc: "EBS 연계 방식 그대로, 논리를 유지한 고난도 변형 지문을 생성합니다." 
                },
                { 
                  icon: <BookOpen className="w-6 h-6 text-violet-600" />,
                  title: "인터랙티브 학습", 
                  desc: "태블릿에 최적화된 화면에서 지문 비교와 즉각적인 피드백을 경험하세요." 
                }
              ].map((item, idx) => (
                <div key={idx} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all">
                  <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed word-keep">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: LOADING */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3 animate-pulse">AI 선생님이 문제를 준비 중입니다...</h3>
            
            <div className="w-full space-y-3">
               <LoadingStep label="기출 데이터베이스 스캐닝 (목표: 5개 이상)" delay={0} />
               <LoadingStep label="원문 텍스트 복원 및 분석" delay={1500} />
               <LoadingStep label="수능형 변형 지문 생성 (Paraphrasing)" delay={3000} />
               <LoadingStep label="3단계 실전 퀴즈 & 어휘장 제작" delay={4500} />
            </div>
          </div>
        )}

        {/* VIEW 3: RESULTS */}
        {step === 2 && analysisState.result && (
          <div className="w-full pt-10 pb-20">
            <AnalysisResult 
              content={analysisState.result} 
              onLoadMore={handleLoadMore}
              isLoadingMore={loadingMore}
            />
          </div>
        )}

        {/* Error Toast */}
        {analysisState.error && step !== 1 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce z-50">
            <span className="bg-white/20 p-1 rounded-full"><Sparkles className="w-4 h-4" /></span>
            <span className="font-medium">{analysisState.error}</span>
          </div>
        )}

      </main>
    </div>
  );
};

// Simple Loading Step Component
const LoadingStep = ({ label, delay }: { label: string, delay: number }) => {
  const [active, setActive] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`flex items-center space-x-3 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-primary' : 'bg-slate-300'}`}></div>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
};

export default App;