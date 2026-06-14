import { GoogleGenAI, SchemaType } from "@google/genai";
import { CSAT_CONTEXT_DATA } from "../data/database";
import { StudySet } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
**Role & Authority**
You are '은영스쿨(Eunyoung School) AI', a top-tier CSAT English Content Engine. 
Your goal is to search the provided database snippets, identify the full original exam passages from your internal knowledge, and generate a structured JSON object for a tablet-based educational app.

**CORE TASKS**
1. **Deep Search & Retrieval:** 
   - Analyze the [INTERNAL DATABASE] snippets.
   - Identify **AT LEAST 5** passages relevant to the User's Keyword.
   - If a list of "Excluded Sources" is provided, **DO NOT** select those passages. Find different ones.
   - If exact matches are fewer than 5, include passages with tangential relevance (e.g., broad theme).
   - **CRITICAL:** The database only contains snippets. You must use your internal training data to **RECONSTRUCT THE FULL ORIGINAL PASSAGE**. Do not output the truncated snippet.
2. **Content Generation:** For EACH identified passage:
   - **Original Text:** The full, un-truncated English passage.
   - **Modified Text:** A high-quality PARAPHRASED version of the passage. It must be length-equivalent to a standard CSAT passage (approx 150-200 words) and maintain High School Grade 1 difficulty. Do not just change a few words; rewrite the structure while keeping the logic.
   - **3 Quiz Questions:** Based on the *Modified Text* (1. Topic, 2. Title, 3. Blank Inference).
   - **Vocabulary:** Extract 5 key words.
3. **Format:** Return PURE JSON.

**JSON STRUCTURE**
{
  "keyword": "User's Keyword",
  "totalFound": Number,
  "items": [
    {
      "id": Number,
      "source": "Year/Month/Grade/Question Number",
      "relevanceReason": "Short phrase explaining why this was picked",
      "originalText": "Full English Text (approx 150 words)...",
      "modifiedText": "Full Paraphrased English Text (approx 150 words)...",
      "questions": [
        {
          "id": 1,
          "type": "Topic", 
          "questionText": "Question Stem...",
          "options": ["Option1", "Option2", "Option3", "Option4", "Option5"],
          "correctAnswer": 1, 
          "explanation": "Detailed explanation in Korean..."
        }
      ],
      "vocabulary": [
        { "word": "example", "meaning": "예시" }
      ]
    }
  ]
}
`;

export const analyzeText = async (keyword: string, excludeSources: string[] = []): Promise<StudySet> => {
  try {
    let exclusionNote = "";
    if (excludeSources.length > 0) {
      exclusionNote = `
      [EXCLUSION LIST]
      The user has already studied the following passages. **DO NOT** include these in the result. Find DIFFERENT passages related to the keyword.
      - ${excludeSources.join('\n- ')}
      `;
    }

    const prompt = `
    [INTERNAL DATABASE SNIPPETS BEGINS]
    ${CSAT_CONTEXT_DATA}
    [INTERNAL DATABASE SNIPPETS ENDS]

    User Keyword: "${keyword}"
    ${exclusionNote}
    
    Task: 
    1. Identify at least 5 relevant passages based on the snippets (excluding the ones above).
    2. Retrieve the FULL TEXT for each.
    3. Create a MODIFIED version for each.
    4. Generate questions based on the MODIFIED version.
    5. Return JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.5, // Increased slightly for variety in new searches
      }
    });

    if (!response.text) {
      throw new Error("No data returned from AI");
    }

    const data = JSON.parse(response.text) as StudySet;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("학습 데이터를 생성하는 중 문제가 발생했습니다. 키워드를 변경하거나 잠시 후 다시 시도해주세요.");
  }
};