import React from 'react';
import { Icons } from './Icons';
import { AnalysisResponse, AnalysisMode } from '../services/gemini';

interface AnalysisResultProps {
  image: string;
  data: AnalysisResponse | null;
  mode: AnalysisMode;
  onReset: () => void;
  loading: boolean;
}

// Helper to strip basic markdown symbols if the AI slips up
const stripMarkdown = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/__(.*?)__/g, '$1')     // Bold
    .replace(/_(.*?)_/g, '$1')       // Italic
    .replace(/^#+\s/gm, '')          // Headers
    .replace(/`/g, '');              // Code ticks
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ image, data, mode, onReset, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-stone-800 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icons.Camera className="w-6 h-6 text-stone-600" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-medium text-stone-300">
          {mode === 'optimize' ? '正在诊断照片...' : '正在分析风格...'}
        </h3>
        <p className="mt-2 text-stone-500">AI 正在计算 Canon R50 的{mode === 'optimize' ? '优化建议' : '复刻参数'}</p>
      </div>
    );
  }

  if (!data) return null;

  const cleanGuide = stripMarkdown(data.r50Guide);
  const cleanTips = data.tips.map(stripMarkdown);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto lg:h-[calc(100vh-140px)] lg:min-h-[600px] h-auto">
      {/* Left Column: Image Preview */}
      <div className="lg:w-1/2 flex flex-col lg:h-full">
        <div className="relative h-64 sm:h-80 lg:h-auto lg:flex-grow bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl group shrink-0">
          <img 
            src={image} 
            alt="Uploaded analysis" 
            className="w-full h-full object-contain bg-black/50"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={onReset}
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-orange-400 transition-colors"
            >
              <Icons.Refresh className="w-4 h-4" />
              分析另一张照片
            </button>
          </div>
        </div>
        
        {/* Estimated Settings Bar - Updated for 6 items */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Mode */}
          <div className="bg-stone-800/50 p-2 sm:p-3 rounded-xl border border-stone-800 text-center">
            <Icons.Settings className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-orange-500" />
            <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">模式</div>
            <div className="font-bold text-stone-200 text-xs sm:text-sm truncate">{data.estimatedSettings.mode.split(' ')[0]}</div>
          </div>
          {/* Aperture */}
          <div className="bg-stone-800/50 p-2 sm:p-3 rounded-xl border border-stone-800 text-center">
            <Icons.Aperture className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-blue-400" />
            <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">光圈</div>
            <div className="font-bold text-stone-200 text-xs sm:text-sm">{data.estimatedSettings.aperture}</div>
          </div>
          {/* Shutter */}
          <div className="bg-stone-800/50 p-2 sm:p-3 rounded-xl border border-stone-800 text-center">
            <Icons.Shutter className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-green-400" />
            <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">快门</div>
            <div className="font-bold text-stone-200 text-xs sm:text-sm">{data.estimatedSettings.shutterSpeed}</div>
          </div>
          {/* ISO */}
          <div className="bg-stone-800/50 p-2 sm:p-3 rounded-xl border border-stone-800 text-center">
            <Icons.ISO className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-yellow-400" />
            <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">ISO</div>
            <div className="font-bold text-stone-200 text-xs sm:text-sm">{data.estimatedSettings.iso}</div>
          </div>
          {/* White Balance */}
          <div className="bg-stone-800/50 p-2 sm:p-3 rounded-xl border border-stone-800 text-center">
            <Icons.WhiteBalance className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-amber-400" />
            <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">白平衡</div>
            <div className="font-bold text-stone-200 text-xs sm:text-sm truncate">{data.estimatedSettings.whiteBalance}</div>
          </div>
          {/* WB Shift */}
          <div className="bg-stone-800/50 p-2 sm:p-3 rounded-xl border border-stone-800 text-center">
            <Icons.WBShift className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-purple-400" />
            <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">WB偏移</div>
            <div className="font-bold text-stone-200 text-xs sm:text-sm truncate">{data.estimatedSettings.wbShift}</div>
          </div>
        </div>
      </div>

      {/* Right Column: Guide & Tips */}
      <div className="lg:w-1/2 flex flex-col gap-6 lg:overflow-y-auto lg:custom-scrollbar lg:pr-2 lg:pb-10">
        
        {/* Main Guide Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className={`rounded-lg p-2 text-white ${mode === 'optimize' ? 'bg-purple-600' : 'bg-orange-500'}`}>
              {mode === 'optimize' ? <Icons.Sparkles className="w-6 h-6" /> : <Icons.Camera className="w-6 h-6" />}
            </div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'optimize' ? 'R50 优化指南' : 'R50 复刻指南'}
            </h2>
          </div>
          <div className="prose prose-invert prose-stone max-w-none">
            {/* Added whitespace-pre-wrap to handle newlines without markdown */}
            <p className="text-stone-300 leading-relaxed whitespace-pre-wrap font-sans">
              {cleanGuide}
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-stone-400">
            <Icons.Check className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-stone-200">
              {mode === 'optimize' ? '诊断与改进' : '优化建议'}
            </h3>
          </div>
          <ul className="space-y-4">
            {cleanTips.map((tip, index) => (
              <li key={index} className="flex gap-3 text-stone-300 bg-stone-950/50 p-3 rounded-xl border border-stone-800/50">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-stone-800 text-xs font-bold text-stone-500">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Warning/Disclaimer */}
        <div className="flex gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <Icons.Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-200/80 leading-relaxed">
            AI 生成的参数仅供参考。实际效果受环境光影响，建议开启 R50 的“模拟曝光”功能实时预览。
          </p>
        </div>
      </div>
    </div>
  );
};