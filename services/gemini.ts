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

export const analyzeImageForR50 = async (base64Image: string): Promise<AnalysisResponse> => {
  const prompt = `
    你是一位精通 Canon EOS R50 相机的专业摄影导师。
    请分析上传的照片，并为初学者提供一份详细的拍摄指南，教他们如何使用 Canon R50 复刻这张照片。
    
    请以 JSON 格式返回结果，遵循以下 Schema：
    {
      "estimatedSettings": {
        "aperture": "光圈值，例如 f/2.8",
        "shutterSpeed": "快门速度，例如 1/500",
        "iso": "ISO值，例如 ISO 400",
        "mode": "拍摄模式，例如 光圈优先(Av) 或 手动(M)",
        "whiteBalance": "白平衡模式，例如 '自动(氛围优先)', '日光', '阴影', 'K值 5200K'",
        "wbShift": "白平衡偏移数值 (WB Shift)。必须使用佳能坐标系：B(蓝)/A(琥珀), M(洋红)/G(绿)。请分析图片色调给出具体坐标值，例如 'A2, G1' (偏暖偏绿), 'B3, M2' (偏冷偏紫), 或 'A0, G0' (无偏移)。请务必提供具体数值。"
      },
      "r50Guide": "一段详细的、分步骤的指导段落。纯文本输出，严禁使用 Markdown 格式（绝对不要使用 **粗体**、*斜体* 或 # 标题）。请使用自然语言分段。解释如何在 Canon R50 上设置这些参数，提及具体的物理按键或触摸屏操作。",
      "tips": [
        "建议1 (纯文本，无Markdown)",
        "建议2 (纯文本，无Markdown)",
        "建议3 (纯文本，无Markdown)"
      ]
    }
    
    重要规则：
    1. 输出内容必须是纯文本，不要包含任何 Markdown 格式符号（如 *, #, -, [] 等）。
    2. 白平衡偏移 (WB Shift) 必须是具体的坐标数值，如 "A2, G1"。
    3. 确保建议针对佳能 R50 (APS-C, RF-S 系统)。
    4. 务必使用中文回答。
  `;

  try {
    // Remove header if present (e.g., data:image/jpeg;base64,)
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, API handles most standard types
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