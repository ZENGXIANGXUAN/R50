import React, { useCallback, useState } from 'react';
import { Icons } from './Icons';

interface PhotoUploadProps {
  onImageSelected: (base64: string) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, []);

  return (
    <div 
      className="w-full max-w-xl mx-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label 
        className={`
          flex flex-col items-center justify-center w-full h-80 
          border-2 border-dashed rounded-2xl cursor-pointer 
          transition-all duration-300 group
          ${isDragging 
            ? 'border-orange-500 bg-stone-900/50 scale-[1.02]' 
            : 'border-stone-700 bg-stone-900/30 hover:border-orange-500/50 hover:bg-stone-900/80'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={`
            p-4 rounded-full mb-4 transition-colors duration-300
            ${isDragging ? 'bg-orange-500/20 text-orange-500' : 'bg-stone-800 text-stone-400 group-hover:text-orange-400'}
          `}>
            <Icons.Upload className="w-10 h-10" />
          </div>
          <p className="mb-2 text-xl font-semibold text-stone-200">
            点击或拖拽上传照片
          </p>
          <p className="text-sm text-stone-500">
            支持 JPG, PNG (最大 10MB)
          </p>
          <p className="mt-4 text-xs text-orange-500/80 font-medium bg-orange-500/10 px-3 py-1 rounded-full">
            Canon R50 专属调参助手
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};