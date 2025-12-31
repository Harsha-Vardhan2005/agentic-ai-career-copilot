// import dotenv from "dotenv";

// dotenv.config();

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/* ===========================
   CAREER ROADMAP 
   =========================== */
export const generateCareerRoadmap = async (profileData) => {
  try {
    const prompt = `
You are a career advisor AI.

You MUST return ONLY valid JSON.
DO NOT include explanations, markdown, headings, or text outside JSON.

Return JSON strictly in this format:
{
  "phases": [
    {
      "title": "Foundation Phase",
      "duration": "X weeks",
      "tasks": ["task1", "task2", "task3"]
    }
  ],
  "nextActions": ["action1", "action2", "action3"]
}

STUDENT PROFILE:
- Education: ${profileData.degree}, ${profileData.year}
- Target Role: ${profileData.careerRole}
- Skills: ${profileData.skills.join(', ')}
- Has Projects: ${profileData.hasProjects ? 'Yes' : 'No'}
- Has Internships: ${profileData.hasInternships ? 'Yes' : 'No'}

Create a realistic 6-month career roadmap.
`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // 🔥 FORCE JSON PARSE
    let parsed;
    try {
      parsed = JSON.parse(
        content.replace(/```json/g, '').replace(/```/g, '').trim()
      );
    } catch (e) {
      console.error('AI DID NOT RETURN VALID JSON:', content);
      throw new Error('Invalid AI roadmap format');
    }

    return parsed; // ← THIS is what your UI expects
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw error;
  }
};

/* ===========================
   RESUME ANALYSIS
   =========================== */
export const analyzeResume = async (resumeText, profileData) => {
  try {
    const prompt = `You are an expert resume reviewer and senior career coach with 15+ years of experience. You're reviewing a resume for someone targeting a ${profileData.careerRole} position.

CANDIDATE PROFILE:
- Name: ${profileData.name || 'Candidate'}
- Education: ${profileData.degree}, ${profileData.year} at ${profileData.college}
- Target Role: ${profileData.careerRole}
- Career Goal: ${profileData.careerGoal}
- Current Skills: ${profileData.skills.join(', ')}
- Interests: ${profileData.interests.join(', ')}
- Experience Level: ${profileData.experienceLevel}
- Has Done Projects: ${profileData.hasProjects ? 'Yes' : 'No'}
- Has Internship Experience: ${profileData.hasInternships ? 'Yes' : 'No'}
- Certifications: ${profileData.certifications || 'None mentioned'}

RESUME TO ANALYZE:
${resumeText}

Provide a comprehensive, detailed analysis in a conversational yet professional tone. Structure your response with these sections:

📊 OVERALL ASSESSMENT
Give an overall score out of 100 and explain what this score means. Be honest but encouraging.

💪 STRENGTHS
Highlight what's working well in this resume. Be specific - mention actual content from their resume. What would make recruiters interested?

⚠️ AREAS FOR IMPROVEMENT
What's holding this resume back? Be constructive and specific. Point out gaps, unclear sections, or missed opportunities.

🎯 SKILLS ALIGNMENT CHECK
Compare the resume against their profile:
- Which of their skills (${profileData.skills.join(', ')}) are well-represented?
- Which skills are missing or underrepresented?
- Are there skills in the resume that don't match their target role of ${profileData.careerRole}?
- Does the resume align with their goal: "${profileData.careerGoal}"?

🤖 ATS (Applicant Tracking System) COMPATIBILITY
Will this resume pass ATS systems? Check for:
- Keyword optimization for ${profileData.careerRole}
- Format issues (tables, images, columns that ATS can't read)
- Standard section headings
- Specific improvement suggestions

✍️ SPECIFIC RECOMMENDATIONS
Give 5-7 actionable suggestions with examples:
- What sections to add/remove/modify
- How to rephrase bullet points (give before/after examples)
- What keywords to include
- How to better showcase projects/internships

🎓 TAILORING FOR ${profileData.careerRole}
How can they make this resume more appealing for ${profileData.careerRole} positions specifically? What do recruiters in this field look for?

📝 FINAL VERDICT
Summarize: Is this resume ready to send? What's the priority fix? What's the potential if they implement your suggestions?

Write in a helpful, encouraging tone. Be specific and reference actual content from their resume. Give examples where possible.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 3500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};


/* ===========================
   AI PERSONALIZED RECOMMENDATIONS 
   =========================== */
export const getAIRecommendations = async (profileData) => {
  try {
    const prompt = `
You are an AI career recommendation agent.

You MUST return ONLY valid JSON.
DO NOT include explanations, markdown, or extra text.

Return JSON strictly in this format:
{
  "job": {
    "title": "",
    "company": "",
    "match": number,
    "applyUrl": ""
  },
  "mentor": {
    "reason": "",
    "ctaRoute": "/mentors"
  },
  "learning": {
    "task": "",
    "ctaRoute": "/learning-path"
  }
}

USER PROFILE:
- Education: ${profileData.degree}, ${profileData.year}
- College: ${profileData.college}
- Target Role: ${profileData.careerRole}
- Skills: ${profileData.skills.join(', ')}
- Interests: ${profileData.interests?.join(', ') || 'Not specified'}
- Has Projects: ${profileData.hasProjects ? 'Yes' : 'No'}
- Has Internships: ${profileData.hasInternships ? 'Yes' : 'No'}

Rules:
- Job applyUrl MUST be a REAL public careers page (Google, Microsoft, Amazon, etc.)
- Mentor suggestion should explain WHY (1 line)
- Learning task should be actionable (not generic)

Return only JSON.
`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(
        content.replace(/```json/g, '').replace(/```/g, '').trim()
      );
    } catch (e) {
      console.error('AI DID NOT RETURN VALID JSON:', content);
      throw new Error('Invalid AI recommendation format');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    throw error;
  }
};
