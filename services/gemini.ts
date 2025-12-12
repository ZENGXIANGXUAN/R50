import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResponse {
  estimatedSettings: {
    aperture: string;
    shutterSpeed: string;
    iso: string;
    mode: string;
    whiteBalance: string;
    wbShift: string;
  };
  r50Guide: string;
  tips: string[];
}

export type AnalysisMode = 'replicate' | 'optimize';

export const analyzeImageForR50 = async (base64Image: string, mode: AnalysisMode): Promise<AnalysisResponse> => {
  const commonRules = `
    重要规则：
    1. 输出内容必须是纯文本，不要包含任何 Markdown 格式符号（如 *, #, -, [] 等）。
    2. 白平衡偏移 (WB Shift) 必须是具体的坐标数值，如 "A2, G1"。请使用佳能坐标系：B(蓝)/A(琥珀), M(洋红)/G(绿)。
    3. 确保建议专门针对 Canon R50 的界面（APS-C 画幅，RF-S 镜头系统）。
    4. 务必使用中文回答。
    5. 返回格式必须是严格的 JSON。
  `;

  const replicatePrompt = `
    你是一位精通 Canon EOS R50 相机的专业摄影导师。
    用户上传了一张照片，希望**复刻（模仿）**这张照片的风格和外观。
    请分析照片的光线、景深、色调，教用户如何在 Canon R50 上设置参数来拍出类似的效果。

    请以 JSON 格式返回结果，遵循以下 Schema：
    {
      "estimatedSettings": {
        "aperture": "推测这张照片的光圈值，例如 f/2.8",
        "shutterSpeed": "推测快门速度，例如 1/500",
        "iso": "推测ISO值，例如 ISO 400",
        "mode": "推荐拍摄模式，例如 光圈优先(Av)",
        "whiteBalance": "推测白平衡模式，例如 '日光' 或 'K值 5600K'",
        "wbShift": "推测白平衡偏移，例如 'A2, G1'"
      },
      "r50Guide": "一段详细的指导，解释如何设置 R50 来模仿这张照片的风格。提及 '创意辅助' 或具体的 Av/Tv/M 模式操作。纯文本输出，无 Markdown。",
      "tips": [
        "关于构图或光线的模仿建议 (纯文本)",
        "关于 R50 特定功能(如胶片模拟)的建议 (纯文本)",
        "其他复刻技巧 (纯文本)"
      ]
    }
    ${commonRules}
  `;

  const optimizePrompt = `
    你是一位精通 Canon EOS R50 相机的专业摄影导师。
    用户上传了一张他们拍摄的照片，希望**优化（改进）**这张照片的效果。
    请以专业的眼光诊断照片存在的问题（如：噪点过多、白平衡不准、过曝/欠曝、主体不清晰、构图杂乱等）。
    然后，提供一套**更优的**参数设置，教用户如何用 R50 重新拍摄一张更好的照片。

    请以 JSON 格式返回结果，遵循以下 Schema：
    {
      "estimatedSettings": {
        "aperture": "建议的更优光圈值，例如 f/4 (如原图虚化过度或不足)",
        "shutterSpeed": "建议的更优快门速度",
        "iso": "建议的更优ISO (如原图噪点多，建议低ISO)",
        "mode": "建议拍摄模式，例如 手动(M)",
        "whiteBalance": "建议的修正白平衡",
        "wbShift": "建议的白平衡偏移修正，例如 'B1, M1' 以校正色偏"
      },
      "r50Guide": "一段详细的诊断和指导。首先指出原图可能存在的问题（纯文本，不要用列表符），然后解释为什么要使用新的设置。指导用户如何在 R50 上操作。纯文本输出，无 Markdown。",
      "tips": [
        "针对原图具体问题的改进建议 (纯文本)",
        "关于 R50 辅助功能(如直方图、斑马纹)的使用建议 (纯文本)",
        "构图优化建议 (纯文本)"
      ]
    }
    ${commonRules}
  `;

  const prompt = mode === 'optimize' ? optimizePrompt : replicatePrompt;

  try {
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};