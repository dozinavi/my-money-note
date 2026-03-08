import Tesseract from 'tesseract.js';

export const extractAmountFromReceipt = async (imageFile: File): Promise<number | null> => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'kor+eng', // Recognize both Korean and English
      { 
        logger: m => console.log(m) // Optional: log progress
      }
    );

    console.log("OCR Text:", text);

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const totalKeywords = ['합계', '결제금액', '받을금액', '총액', 'Total', 'TOTAL', 'AMOUNT', 'Amount', '합 계', '결제 금액'];
    
    let candidateAmount = 0;
    let foundKeywordMatch = false;

    // Strategy 1: Look for lines containing keywords and a number
    for (const line of lines) {
      const hasKeyword = totalKeywords.some(keyword => line.includes(keyword));
      
      if (hasKeyword) {
        // Extract numbers, allowing for commas and periods (e.g. 1,000 or 1000)
        // Regex to capture numbers with optional commas
        const numbers = line.match(/[\d,]+/g);
        
        if (numbers) {
          for (const numStr of numbers) {
            // Remove commas
            const cleanNumStr = numStr.replace(/,/g, '');
            const num = parseInt(cleanNumStr, 10);
            
            // Basic validation: amount should be reasonable (e.g. > 0)
            // Also, avoid picking up dates like 2023, 2024 if possible, but hard to distinguish without context.
            // However, total amount is usually the largest number on the receipt.
            if (!isNaN(num) && num > 0) {
              if (num > candidateAmount) {
                candidateAmount = num;
                foundKeywordMatch = true;
              }
            }
          }
        }
      }
    }

    if (foundKeywordMatch) {
      return candidateAmount;
    }

    // Strategy 2: If no keyword match, look for the largest number in the text that looks like a price
    // Prices often end in 00, 000, etc. in KRW.
    let maxNum = 0;
    for (const line of lines) {
       const numbers = line.match(/[\d,]+/g);
       if (numbers) {
         for (const numStr of numbers) {
           const cleanNumStr = numStr.replace(/,/g, '');
           const num = parseInt(cleanNumStr, 10);
           if (!isNaN(num) && num > 0) {
             if (num > maxNum) {
               maxNum = num;
             }
           }
         }
       }
    }

    return maxNum > 0 ? maxNum : null;

  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};
