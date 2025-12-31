import Tesseract from 'tesseract.js';

export const extractTextWithOCR = async (file) => {
  try {
    const { data } = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => console.log(m), // optional progress logs
      }
    );

    return data.text;
  } catch (error) {
    console.error('OCR failed:', error);
    throw new Error('OCR failed. Unable to read scanned PDF.');
  }
};
