// We declare the global pdfjsLib variable which is loaded via CDN in index.html
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (!window.pdfjsLib) {
        reject(new Error("PDF.js library not loaded"));
        return;
      }

      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Iterate through all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Combine text items, adding spaces for basic separation
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
          
        fullText += `\n--- Page ${i} ---\n${pageText}`;
      }
      
      resolve(fullText);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      reject(error);
    }
  });
};