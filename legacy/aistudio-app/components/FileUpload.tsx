import React, { useRef, useState } from 'react';
import { extractTextFromPdf } from '../utils/pdfUtils';
import { FileData } from '../types';
import { Upload, Loader2, AlertCircle, FileCheck } from 'lucide-react';

interface FileUploadProps {
  onFilesProcessed: (files: FileData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesProcessed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setSuccessMsg(null);
    
    const processedFiles: FileData[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf') {
          try {
            const text = await extractTextFromPdf(file);
            // Basic validation to ensure text was extracted
            if (text.trim().length < 50) {
                console.warn(`File ${file.name} yielded little text. It might be an image-only PDF.`);
            }
            processedFiles.push({
              id: `${file.name}-${Date.now()}-${i}`,
              name: file.name,
              content: text
            });
          } catch (e) {
            console.error(`Failed to parse ${file.name}`, e);
          }
        }
      }
      
      if (processedFiles.length > 0) {
        onFilesProcessed(processedFiles);
        setSuccessMsg(`Successfully processed ${processedFiles.length} file(s).`);
      } else {
        setError("No valid PDF files could be processed. Ensure they are text-based PDFs.");
      }
    } catch (err) {
      console.error("File processing failed", err);
      setError("An error occurred while processing files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    processFiles(files);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer overflow-hidden
          ${dragActive ? 'border-primary bg-blue-50/50' : 'border-slate-300 bg-white hover:border-primary/50 hover:bg-slate-50'}
        `}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center animate-pulse py-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
            <p className="text-lg font-medium text-slate-700">Reading PDF contents...</p>
            <p className="text-sm text-slate-400">Please wait while we digitize your exams.</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Upload Exam Papers (PDF)
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Drag & drop files here or click to browse
            </p>
            {successMsg && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-2">
                    <FileCheck className="w-4 h-4 mr-2" /> {successMsg}
                </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;