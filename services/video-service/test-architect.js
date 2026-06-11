const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL = 'deepseek-r1:8b';

async function testArchitect() {
    const allSummariesText = "Block 1 (0s - 600s): Host introduces the topic of wealth building and viral hooks.\n\nBlock 2 (600s - 1200s): Host discusses the secret to content creation.\n\nBlock 3 (1200s - 1800s): Host concludes the video with a call to action.";
    const finalPrompt = `You are a Video Architect. Analyze the following sequence of video block summaries and segment the entire video into logical chapters (e.g., Opening, Main Discussion, Climax, Conclusion, Closing).

Summaries:
${allSummariesText}

CRITICAL: Output ONLY a valid JSON array of objects.
Format:
[
  { "chapter": "Opening", "start": 0, "end": 60, "summary": "Short explanation" },
  { "chapter": "Deep Dive", "start": 60, "end": 1200, "summary": "Short explanation" }
]
Do not include markdown or reasoning. Just the JSON array.`;

    console.log("Sending prompt to Ollama...");
    try {
        const res = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: MODEL, prompt: finalPrompt, stream: false, format: 'json' })
        });
        
        let finalResponse = (await res.json()).response;
        console.log("RAW RESPONSE:", finalResponse);
        
        if (finalResponse.includes('</think>')) {
            finalResponse = finalResponse.split('</think>')[1].trim();
        }
        finalResponse = finalResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        console.log("PARSED CLEAN TEXT:", finalResponse);
        const chapters = JSON.parse(finalResponse);
        console.log("JSON PARSED SUCCESSFULLY:", chapters);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

testArchitect();
