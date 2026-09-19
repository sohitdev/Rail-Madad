const { DEPARTMENTS } = require('../config/constants');

function normalizeDepartment(department) {
  if (!department) return null;
  const exactMatch = DEPARTMENTS.find((d) => d.toLowerCase() === String(department).toLowerCase());
  return exactMatch || null;
}

function keywordClassify(description = '') {
  const text = String(description).toLowerCase();

  if (/medical|injury|emergency|doctor|ambulance|fire|smoke|safety|steal|theft|fight|harass|security|police/.test(text)) {
    if (/medical|injury|emergency|doctor|ambulance/.test(text)) return { department: 'Medical and Emergency', priority: 'High' };
    if (/smoke|fire|safety|pollution|environment/.test(text)) return { department: 'Environmental and Safety Compliance', priority: 'High' };
    return { department: 'Security', priority: 'High' };
  }

  if (/dirty|toilet|washroom|clean|hygiene|garbage/.test(text)) return { department: 'Cleanliness and Hygiene Department', priority: 'Medium' };
  if (/food|meal|cater|water bottle|vendor/.test(text)) return { department: 'Catering and On-Board Services', priority: 'Medium' };
  if (/ticket|reservation|booking|refund|waitlist/.test(text)) return { department: 'Ticketing and Reservations', priority: 'Medium' };
  if (/late|delay|punctual|reschedule/.test(text)) return { department: 'Punctuality and Train Reservations', priority: 'Low' };
  if (/staff|rude|behavior|behaviour|misconduct/.test(text)) return { department: 'Staff Behaviour', priority: 'Medium' };
  if (/luggage|parcel|bag|baggage/.test(text)) return { department: 'Luggage and Parcels', priority: 'Low' };
  if (/platform|station|escalator|lift|announcement/.test(text)) return { department: 'Station Facilities', priority: 'Medium' };
  if (/app|website|server|technical|error|bug/.test(text)) return { department: 'Technical Support', priority: 'Low' };

  return { department: 'Customer Services and Grievances', priority: 'Medium' };
}

function extractJson(rawText = '') {
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function classifyComplaint(description) {
  const fallback = keywordClassify(description);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      department: fallback.department,
      priority: fallback.priority,
      confidence: 0.45,
      reason: 'Keyword fallback (Gemini key not configured)',
      method: 'keyword'
    };
  }

  const prompt = [
    'Classify the railway complaint into exactly one department from this list:',
    DEPARTMENTS.join(' | '),
    '',
    'Also determine the priority (High, Medium, Low) based on urgency. Medical, fire, or severe security issues are High.',
    '',
    `Complaint: ${description}`,
    '',
    'Return ONLY JSON in this shape:',
    '{"department":"...","priority":"High|Medium|Low","confidence":0.0,"reason":"..."}'
  ].join('\n');

  try {
    const modelCandidates = ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-flash-lite-latest'];
    let lastError = null;

    for (const model of modelCandidates) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        lastError = new Error(`Gemini API error: ${response.status} (${model})`);
        continue;
      }

      const data = await response.json();
      const outputText =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';

      const parsed = extractJson(outputText) || {};
      const department = normalizeDepartment(parsed.department) || fallback.department;
      const confidence = Number(parsed.confidence);
      const priority = ['High', 'Medium', 'Low'].includes(parsed.priority) ? parsed.priority : fallback.priority;

      return {
        department,
        priority,
        confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0.7,
        reason: parsed.reason
          ? String(parsed.reason).slice(0, 255)
          : `Gemini classification (${model})`,
        method: 'gemini'
      };
    }

    throw lastError || new Error('Gemini API did not return a usable response');
  } catch (error) {
    console.error('Classification fallback used:', error.message);
    return {
      department: fallback.department,
      priority: fallback.priority,
      confidence: 0.5,
      reason: `Keyword fallback (${error.message})`,
      method: 'keyword'
    };
  }
}

module.exports = { classifyComplaint };
