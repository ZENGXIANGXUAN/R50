import React, { useState } from 'react';
import { PhotoUpload } from './components/PhotoUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeImageForR50, AnalysisResponse } from './services/gemini';
import { Icons } from './components/Icons';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    setImage(base64);
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeImageForR50(base64);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("分析图片失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 selection:bg-orange-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-stone-950/80 backdrop-blur-md border-b border-stone-800 z-50 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-orange-600 text-white p-1.5 rounded-md">
              <Icons.Camera className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Canon <span className="text-orange-500">R50</span> 摄影助手
            </span>
          </div>
          {image && !loading && (
             <button 
             onClick={handleReset}
             className="md:hidden text-stone-400 hover:text-white"
           >
             <Icons.Refresh className="w-5 h-5" />
           </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 w-full max-w-7xl mx-auto">
        {!image ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                拍出好照片，<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  从了解你的 R50 开始
                </span>
              </h1>
              <p className="text-lg text-stone-400">
                上传一张你想模仿的照片，AI 将为你解析光圈、快门、ISO，并教你如何在 Canon R50 上进行设置。
              </p>
            </div>
            <PhotoUpload onImageSelected={handleImageSelected} />
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-500 text-sm max-w-3xl">
              <div className="flex flex-col items-center text-center p-4">
                <Icons.Settings className="w-6 h-6 mb-2 text-stone-600" />
                <p>精准参数反推</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Icons.Camera className="w-6 h-6 mb-2 text-stone-600" />
                <p>R50 专属操作指引</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Icons.Check className="w-6 h-6 mb-2 text-stone-600" />
                <p>构图与光线建议</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
             {error ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-red-500 mb-4 bg-red-500/10 p-3 rounded-full">
                    <Icons.Info className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-200 mb-2">出错了</h3>
                  <p className="text-stone-500 mb-6">{error}</p>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors"
                  >
                    重试
                  </button>
                </div>
             ) : (
               <AnalysisResult 
                 image={image} 
                 data={analysis} 
                 loading={loading} 
                 onReset={handleReset} 
               />
             )}
          </div>
        )}
      </main>
    </div>
  );
}