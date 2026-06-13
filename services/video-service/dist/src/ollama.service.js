"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OllamaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const common_1 = require("@nestjs/common");
let OllamaService = OllamaService_1 = class OllamaService {
    logger = new common_1.Logger(OllamaService_1.name);
    OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
    MODEL = 'qwen2.5:32b';
    async fetchWithRetry(url, options, retries = 3, timeoutMs = 60000) {
        for (let i = 0; i < retries; i++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetch(url, { ...options, signal: controller.signal });
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`API status ${response.status}`);
                }
                return response;
            }
            catch (error) {
                clearTimeout(timeoutId);
                const isLast = i === retries - 1;
                if (isLast)
                    throw error;
                this.logger.warn(`AI request failed (${error.message}). Retrying ${i + 1}/${retries} in ${2 * (i + 1)}s...`);
                await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
            }
        }
    }
    async generateClipTitles(topic, intent) {
        this.logger.log(`Requesting titles from Ollama (Model: ${this.MODEL}) for topic: "${topic || 'General content'}", intent: "${intent || 'Viral Hook'}"`);
        const prompt = `You are an expert AI Video Clipper and Viral Copywriter. 
I am creating short clips for TikTok, IG Reels, and YT Shorts.
The main topic of the video is: "${topic || 'General engaging content'}".
The vibe/intent of the clips should be: "${intent || 'Viral Hook'}".

Generate exactly 3 short, extremely catchy, clickbait titles for these clips. 
Return ONLY a valid JSON array of 3 strings. Do not include any other text, markdown formatting, or explanations. 
Example of expected output: ["Mind-blowing secret revealed!", "You won't believe this happened", "Wait for the end..."]`;
        try {
            const response = await this.fetchWithRetry(this.OLLAMA_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    prompt: prompt,
                    stream: false,
                    format: 'json'
                }),
            });
            if (!response.ok) {
                throw new Error(`Ollama API responded with status ${response.status}`);
            }
            const data = await response.json();
            let responseText = data.response;
            this.logger.debug(`Ollama Raw Response: ${responseText}`);
            if (responseText.includes('</think>')) {
                responseText = responseText.split('</think>')[1].trim();
            }
            const parsedArray = JSON.parse(responseText);
            if (Array.isArray(parsedArray) && parsedArray.length >= 3) {
                return [parsedArray[0], parsedArray[1], parsedArray[2]];
            }
            else {
                throw new Error("Parsed response is not an array of at least 3 strings");
            }
        }
        catch (error) {
            this.logger.error(`Failed to generate titles from Ollama: ${error.message}`);
            this.logger.warn(`Falling back to default titles.`);
            if (intent === 'Funny Moments') {
                return ["Comedy Hook", "Funny Story", "Laugh Shorts"];
            }
            else if (intent === 'Educational') {
                return ["Did You Know?", "Quick Fact Story", "Edu Shorts"];
            }
            else if (intent === 'Gaming Highlight') {
                return ["Epic Play", "Gaming Story", "Clutch Shorts"];
            }
            return ["Viral TikTok Hook", "Engaging Story", "YouTube Shorts Teaser"];
        }
    }
    getFallbackClips(duration) {
        const clips = [];
        clips.push({ title: "Viral Start", reason: "Fallback logic", start: 0, end: Math.min(15, duration), score: 90 });
        if (duration > 15)
            clips.push({ title: "Engaging Middle", reason: "Fallback logic", start: 15, end: Math.min(30, duration), score: 85 });
        if (duration > 30)
            clips.push({ title: "Unexpected End", reason: "Fallback logic", start: 30, end: Math.min(45, duration), score: 80 });
        return clips;
    }
    async mapVideoChapters(transcript, duration) {
        this.logger.log(`[LAYER 0] The Architect (Semantic Video Mapping)...`);
        const CHUNK_DUR = 600;
        let summaries = [];
        let currentStart = 0;
        let chunkIndex = 1;
        while (currentStart < duration) {
            const chunkEnd = currentStart + CHUNK_DUR;
            const chunkSegments = transcript.filter(s => s.start >= currentStart && s.start < chunkEnd);
            if (chunkSegments.length > 0) {
                let chunkText = chunkSegments.map(s => `[${Math.round(s.start)}s]: ${s.text}`).join('\n');
                if (chunkText.length > 3000) {
                    chunkText = chunkText.substring(0, 3000) + "\n...[TRUNCATED to save CPU memory]...";
                }
                const prompt = `Summarize the main topics discussed in this 10-minute video chunk. 
Be extremely concise. Write 2-3 sentences max.
Transcript Chunk:
${chunkText}
Summary:`;
                try {
                    this.logger.log(`Architect Mapping Phase 1: Summarizing Block ${chunkIndex} (${currentStart}s - ${chunkEnd}s)`);
                    const res = await this.fetchWithRetry(this.OLLAMA_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ model: this.MODEL, prompt, stream: false })
                    }, 3, 1200000);
                    let summary = (await res.json()).response;
                    if (summary.includes('</think>'))
                        summary = summary.split('</think>')[1].trim();
                    summaries.push(`Block ${chunkIndex} (${currentStart}s - ${chunkEnd}s): ${summary.trim()}`);
                }
                catch (e) {
                    this.logger.warn(`Failed to summarize block ${chunkIndex}: ${e.message}`);
                }
            }
            currentStart += CHUNK_DUR;
            chunkIndex++;
        }
        if (summaries.length === 0)
            return [];
        this.logger.log(`Architect Mapping Phase 2: Generating Chapters from Summaries...`);
        const allSummariesText = summaries.join('\n\n');
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
        try {
            const res = await this.fetchWithRetry(this.OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.MODEL, prompt: finalPrompt, stream: false, format: 'json' })
            }, 3, 1200000);
            let finalResponse = (await res.json()).response;
            if (finalResponse.includes('</think>'))
                finalResponse = finalResponse.split('</think>')[1].trim();
            finalResponse = finalResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            let chapters = JSON.parse(finalResponse);
            if (chapters && typeof chapters === 'object' && !Array.isArray(chapters)) {
                chapters = chapters.chapters || chapters.data || Object.values(chapters)[0];
            }
            if (!Array.isArray(chapters)) {
                throw new Error("Parsed chapters is not an array");
            }
            this.logger.log(`[LAYER 0] Architect mapping complete! Found ${chapters.length} chapters.`);
            return chapters;
        }
        catch (e) {
            this.logger.error(`Architect Mapping Phase 2 failed: ${e.message}`);
            return [];
        }
    }
    async analyzeTranscriptForClips(transcript, intent, duration, chapters = []) {
        this.logger.log(`[LAYER 1] The Observer & Hunter (Sliding Window Chunking)...`);
        const CHUNK_DURATION = 300;
        const OVERLAP = 30;
        const chunks = [];
        let currentStartTime = 0;
        while (currentStartTime < duration) {
            const chunkEndTime = currentStartTime + CHUNK_DURATION;
            const chunkSegments = transcript.filter(s => s.start >= currentStartTime && s.start < chunkEndTime);
            if (chunkSegments.length > 0) {
                chunks.push(chunkSegments);
            }
            currentStartTime += (CHUNK_DURATION - OVERLAP);
        }
        if (chunks.length === 0 && transcript.length > 0) {
            chunks.push(transcript);
        }
        let baseClips = [];
        let chaptersContext = "No chapter mapping available.";
        if (chapters && chapters.length > 0) {
            chaptersContext = chapters.map(c => `- ${c.chapter} (${c.start}s - ${c.end}s): ${c.summary}`).join('\n');
        }
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const chunkText = chunk.map(s => `[${s.start}s - ${s.end}s]: ${s.text}`).join('\n');
            const chunkStart = chunk.length > 0 ? chunk[0].start : 0;
            const exampleStart = Math.round((chunkStart + 12.5) * 10) / 10;
            const exampleEnd = Math.round((chunkStart + 45.0) * 10) / 10;
            const pass1Prompt = `You are a Viral Video Hunter. Read this 5-minute transcript chunk.
Find exactly 2 to 3 highly engaging clips for TikTok.
A "Hook" is the first 3-5 seconds. The clip duration must be 15 to 60 seconds.

Video Architecture / Chapters context:
${chaptersContext}

Transcript Chunk:
${chunkText}

CRITICAL: 
1. Output ONLY a JSON array. Do not write titles or reasons.
2. The "start" and "end" values MUST be the exact numbers shown in the brackets [Xs - Ys] of the transcript. DO NOT copy the example numbers!
Format:
[
  { "hook_text": "The exact spoken hook...", "start": ${exampleStart}, "end": ${exampleEnd} }
]
Do not include markdown formatting like \`\`\`json. Return ONLY the raw JSON array.`;
            try {
                this.logger.log(`Hunting clips in Chunk ${i + 1}/${chunks.length} (Model: ${this.MODEL})...`);
                const response1 = await this.fetchWithRetry(this.OLLAMA_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: this.MODEL, prompt: pass1Prompt, stream: false, format: 'json' }),
                }, 3, 1200000);
                let text1 = (await response1.json()).response;
                if (text1.includes('</think>'))
                    text1 = text1.split('</think>')[1].trim();
                text1 = text1.replace(/```json/g, '').replace(/```/g, '').trim();
                let chunkClips = [];
                try {
                    const jsonMatch = text1.match(/\[\s*\{.*\}\s*\]/s);
                    chunkClips = JSON.parse(jsonMatch ? jsonMatch[0] : text1);
                }
                catch (e) {
                    this.logger.warn(`Failed to parse JSON for Chunk ${i + 1}`);
                    continue;
                }
                if (chunkClips && typeof chunkClips === 'object' && !Array.isArray(chunkClips)) {
                    chunkClips = chunkClips.clips || [chunkClips];
                }
                if (Array.isArray(chunkClips)) {
                    baseClips = [...baseClips, ...chunkClips];
                }
            }
            catch (e) {
                this.logger.error(`Layer 1 Hunter Failed for Chunk ${i + 1}: ${e.message}`);
            }
        }
        if (!baseClips || baseClips.length === 0) {
            this.logger.warn(`No clips found in any chunk. Falling back to blind cutting logic.`);
            return this.getFallbackClips(duration);
        }
        this.logger.log(`[LAYER 2] The Critic (Grading ${baseClips.length} clips)...`);
        const finalClips = [];
        for (let i = 0; i < baseClips.length; i++) {
            const clip = baseClips[i];
            let startNum = parseFloat(clip.start);
            let endNum = parseFloat(clip.end);
            if (isNaN(startNum) || isNaN(endNum) || startNum >= endNum) {
                this.logger.warn(`Skipping invalid clip from AI: start=${clip.start}, end=${clip.end}`);
                continue;
            }
            clip.start = startNum;
            clip.end = endNum;
            const clipText = transcript
                .filter(s => s.start >= clip.start && s.end <= clip.end)
                .map(s => s.text)
                .join(' ');
            if (!clipText.trim()) {
                finalClips.push({ ...clip, title: "VIRAL MOMENT", score: 80, reason: "Good visuals" });
                continue;
            }
            const pass2Prompt = `You are a TikTok Copywriter. Read this short clip transcript:
"${clipText}"
Intent: ${intent || 'Viral'}

Generate a viral clickbait title, a virality score (1-100), and a reason why it will go viral.
Output EXACTLY this JSON format:
{
  "title": "ALL CAPS TITLE",
  "score": 95,
  "reason": "Why it goes viral..."
}
Do not include markdown. Return ONLY the raw JSON object.`;
            try {
                const response2 = await this.fetchWithRetry(this.OLLAMA_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: this.MODEL, prompt: pass2Prompt, stream: false, format: 'json' }),
                }, 2, 120000);
                let text2 = (await response2.json()).response;
                if (text2.includes('</think>'))
                    text2 = text2.split('</think>')[1].trim();
                text2 = text2.replace(/```json/g, '').replace(/```/g, '').trim();
                let criticData = {};
                try {
                    const jsonMatch2 = text2.match(/\{\s*".*\}\s*/s);
                    criticData = JSON.parse(jsonMatch2 ? jsonMatch2[0] : text2);
                }
                catch (e) {
                    criticData = { title: "CATCHY VIRAL TITLE", score: 85, reason: "Engaging content" };
                }
                finalClips.push({
                    start: clip.start,
                    end: clip.end,
                    hook_text: clip.hook_text || "Engaging hook...",
                    title: criticData.title || "VIRAL CLIP",
                    score: typeof criticData.score === 'number' ? criticData.score : 85,
                    reason: criticData.reason || "High engagement potential"
                });
                this.logger.log(`Graded Clip ${i + 1}/${baseClips.length}: Score ${criticData.score || 85}`);
            }
            catch (e) {
                this.logger.warn(`Layer 2 Critic Failed for clip ${i + 1}. Using default grades.`);
                finalClips.push({ ...clip, title: "VIRAL MOMENT", score: 80, reason: "Fallback grade" });
            }
        }
        if (finalClips.length === 0) {
            return this.getFallbackClips(duration);
        }
        this.logger.log(`[LAYER 3] Validating and De-duplicating clips...`);
        const uniqueClips = [];
        for (const clip of finalClips) {
            let isDuplicate = false;
            for (const existing of uniqueClips) {
                if (Math.abs(clip.start - existing.start) < 5) {
                    isDuplicate = true;
                    if ((clip.score || 0) > (existing.score || 0)) {
                        existing.score = clip.score;
                        existing.title = clip.title;
                        existing.reason = clip.reason;
                        existing.start = clip.start;
                        existing.end = clip.end;
                    }
                    break;
                }
            }
            if (!isDuplicate)
                uniqueClips.push(clip);
        }
        this.logger.log(`[LAYER 4] Temporal Distribution Checkpoint (Spreading clips evenly)...`);
        uniqueClips.sort((a, b) => (b.score || 0) - (a.score || 0));
        const topClips = [];
        if (uniqueClips.length > 0 && duration > 300) {
            const thirds = [
                { min: 0, max: duration / 3, filled: 0, name: "Opening" },
                { min: duration / 3, max: (duration / 3) * 2, filled: 0, name: "Middle" },
                { min: (duration / 3) * 2, max: duration, filled: 0, name: "Ending" }
            ];
            const MAX_PER_THIRD = 5;
            for (const clip of uniqueClips) {
                const thirdIndex = thirds.findIndex(t => clip.start >= t.min && clip.start <= t.max);
                if (thirdIndex !== -1 && thirds[thirdIndex].filled < MAX_PER_THIRD) {
                    topClips.push(clip);
                    thirds[thirdIndex].filled++;
                }
            }
            for (const clip of uniqueClips) {
                if (topClips.length >= 15)
                    break;
                if (!topClips.some(c => c.start === clip.start)) {
                    topClips.push(clip);
                }
            }
        }
        else {
            for (let i = 0; i < Math.min(15, uniqueClips.length); i++) {
                topClips.push(uniqueClips[i]);
            }
        }
        topClips.sort((a, b) => a.start - b.start);
        this.logger.log(`[LAYER 6] The Pacing Analyzer (Calculating Words Per Minute)...`);
        for (const clip of topClips) {
            const clipSegments = transcript.filter(s => s.start >= clip.start && s.end <= clip.end);
            const clipText = clipSegments.map(s => s.text).join(' ');
            const wordCount = clipText.split(/\s+/).filter(w => w.length > 0).length;
            const clipDurationSeconds = clip.end - clip.start;
            const wpm = clipDurationSeconds > 0 ? Math.round((wordCount / clipDurationSeconds) * 60) : 0;
            clip.wpm = wpm;
            if (wpm > 160) {
                clip.score = Math.min(100, (clip.score || 80) + 3);
                clip.pacing = "Fast & Energetic";
            }
            else if (wpm < 110 && wpm > 0) {
                clip.score = Math.max(0, (clip.score || 80) - 5);
                clip.pacing = "Slow & Dramatic";
            }
            else {
                clip.pacing = "Perfect Rhythm";
            }
        }
        this.logger.log(`[LAYER 7] The Viral Metadata Synthesizer (Auto-Caption & SEO Hashtags)...`);
        for (const clip of topClips) {
            const hashtags = ['#fyp', '#viral'];
            if (intent === 'Educational')
                hashtags.push('#learning', '#edutok');
            else if (intent === 'Funny Moments')
                hashtags.push('#comedy', '#funny');
            else if (intent === 'Gaming Highlight')
                hashtags.push('#gaming', '#gamer');
            else
                hashtags.push('#trending', '#foryou');
            if (clip.pacing === "Fast & Energetic")
                hashtags.push('#intense');
            clip.hashtags = [...new Set(hashtags)].slice(0, 5).join(' ');
            const ctas = [
                "Tonton sampai akhir! 🤯",
                "Gimana menurut kalian? Komen di bawah! 👇",
                "Save video ini biar nggak lupa! 📌",
                "Kalian setuju nggak? 🤔"
            ];
            const randomCta = ctas[Math.floor(Math.random() * ctas.length)];
            clip.socialCaption = `🔥 ${clip.title}\n\n${clip.reason || ''}\n\n${randomCta}\n\n${clip.hashtags}`;
        }
        this.logger.log(`[LAYER 8] The Visual Director (Extracting B-Roll Pexels Keywords)...`);
        for (const clip of topClips) {
            const text = clip.hook_text + " " + (clip.title || "");
            const t = text.toLowerCase();
            if (t.match(/uang|money|bisnis|kaya|investasi|crypto|saham|milyar/))
                clip.brollKeyword = "money business";
            else if (t.match(/sedih|hancur|menangis|depresi|sakit/))
                clip.brollKeyword = "sad alone";
            else if (t.match(/mobil|motor|balapan|cepat|kendaraan/))
                clip.brollKeyword = "sports car";
            else if (t.match(/teknologi|ai|komputer|robot|masa depan/))
                clip.brollKeyword = "futuristic technology";
            else if (t.match(/cinta|pasangan|nikah|jodoh/))
                clip.brollKeyword = "couple romance";
            else if (t.match(/makanan|masak|lezat|lapar|diet/))
                clip.brollKeyword = "delicious food";
            else if (t.match(/sehat|olahraga|gym|lari/))
                clip.brollKeyword = "fitness workout";
            else if (t.match(/alam|gunung|pantai|liburan|travel/))
                clip.brollKeyword = "nature landscape";
            else
                clip.brollKeyword = "abstract background";
        }
        this.logger.log(`[LAYER 9] The Emotional Arc Detector (Vibe Tagging)...`);
        for (const clip of topClips) {
            const text = clip.hook_text + " " + (clip.title || "");
            const t = text.toLowerCase();
            if (t.match(/gila|wow|mind-blowing|rahasia|terbongkar|mustahil/))
                clip.vibe = "🤯 Mind-Blowing";
            else if (t.match(/jangan|salah|bodoh|marah|parah|hancur/))
                clip.vibe = "😡 Controversial";
            else if (t.match(/lucu|ngakak|kocak|humor|ketawa/))
                clip.vibe = "😂 Hilarious";
            else if (t.match(/sedih|tangis|haru|menyesal|maaf/))
                clip.vibe = "🥺 Emotional";
            else
                clip.vibe = "💡 Genius";
        }
        this.logger.log(`[LAYER 10] The Engagement Graph (Calculating Hook Strength & Retention Risk)...`);
        for (const clip of topClips) {
            const hookWords = clip.hook_text ? clip.hook_text.toLowerCase().split(' ').slice(0, 8) : [];
            const hasStrongVerbs = hookWords.some((w) => w.match(/kenapa|bagaimana|cara|jangan|stop|alasan|rahasia|wow|gila|ternyata/));
            clip.hookStrength = hasStrongVerbs ? "🔥 Sangat Kuat" : "⚡ Standar";
            const dur = clip.end - clip.start;
            if (dur < 20)
                clip.retentionRisk = "Beresiko (Terlalu Pendek)";
            else if (dur > 50 && clip.wpm < 130)
                clip.retentionRisk = "Tinggi (Panjang & Lambat)";
            else
                clip.retentionRisk = "Sangat Rendah (Aman)";
        }
        this.logger.log(`[LAYER 11] The Audience Profiler (Predicting Target Demographic)...`);
        for (const clip of topClips) {
            const text = clip.hook_text + " " + (clip.title || "");
            const t = text.toLowerCase();
            if (t.match(/investasi|saham|bisnis|uang|ceo|kaya|omset|startup/))
                clip.targetDemographic = "Pengusaha / Investor";
            else if (t.match(/game|pc|main|teknologi|ai|hp|gadget/))
                clip.targetDemographic = "Gamer / Tech Enthusiast";
            else if (t.match(/pacar|cinta|jodoh|nikah|galau/))
                clip.targetDemographic = "Gen-Z / Remaja";
            else if (t.match(/kesehatan|diet|gym|olahraga|sehat/))
                clip.targetDemographic = "Fitness / Health";
            else
                clip.targetDemographic = "General Audience";
        }
        this.logger.log(`[LAYER 12] The Audio Director (Profiling Background Music)...`);
        for (const clip of topClips) {
            if (clip.vibe === "🤯 Mind-Blowing")
                clip.bgmSuggestion = "Intense Suspense / Cinematic";
            else if (clip.vibe === "😂 Hilarious")
                clip.bgmSuggestion = "Quirky / Silent Comedy BGM";
            else if (clip.vibe === "🥺 Emotional")
                clip.bgmSuggestion = "Slow Cinematic Piano";
            else if (clip.pacing === "Fast & Energetic")
                clip.bgmSuggestion = "Phonk / Aggressive Trap";
            else
                clip.bgmSuggestion = "Lo-Fi / Chill Beats";
        }
        this.logger.log(`[LAYER 13] The A/B Tester (Generating Alternative Title)...`);
        for (const clip of topClips) {
            const origTitle = clip.title || "VIRAL CLIP";
            if (origTitle.length > 20) {
                clip.alternativeTitle = origTitle.split(' ').slice(0, 3).join(' ') + " 🤯";
            }
            else {
                clip.alternativeTitle = "THE TRUTH ABOUT THIS " + (clip.vibe?.split(' ')[1] || "MOMENT").toUpperCase();
            }
        }
        this.logger.log(`[LAYER 14] The Compliance Officer (Scanning for Brand Safety)...`);
        for (const clip of topClips) {
            const text = clip.hook_text + " " + (clip.title || "");
            const t = text.toLowerCase();
            const unsafeWords = /bodoh|bangsat|anjing|tolol|mati|bunuh|sex|porno|judi|slot|gila/g;
            if (t.match(unsafeWords)) {
                clip.brandSafety = "⚠️ Risiko (Sensitif/Kasar)";
            }
            else {
                clip.brandSafety = "✅ Brand Safe";
            }
        }
        this.logger.log(`[LAYER 15] The CTA Strategist (Optimizing Call-To-Action Overlay)...`);
        for (const clip of topClips) {
            if (clip.vibe === "🤯 Mind-Blowing")
                clip.ctaOverlay = "Share Rahasia Ini! ↗️";
            else if (clip.targetDemographic === "Pengusaha / Investor")
                clip.ctaOverlay = "Save untuk Nanti 📌";
            else if (clip.vibe === "😂 Hilarious")
                clip.ctaOverlay = "Tag Teman Kamu! 😂";
            else if (clip.hookStrength === "🔥 Sangat Kuat")
                clip.ctaOverlay = "Link in Bio 🔗";
            else
                clip.ctaOverlay = "Follow for Part 2 ➕";
        }
        this.logger.log(`[LAYER 5] The Editor (Aligning cuts to exact sentence boundaries)...`);
        for (const clip of topClips) {
            const startSegment = transcript.find(s => s.start >= clip.start - 3 && s.start <= clip.start + 3);
            if (startSegment) {
                clip.start = Math.max(0, startSegment.start - 0.2);
            }
            const endSegments = transcript.filter(s => s.end >= clip.end - 3 && s.end <= clip.end + 3);
            if (endSegments.length > 0) {
                const lastSegment = endSegments[endSegments.length - 1];
                clip.end = Math.min(duration, lastSegment.end + 0.5);
            }
            if (clip.end - clip.start < 12) {
                clip.end = Math.min(clip.start + 15, duration);
            }
        }
        this.logger.log(`Successfully passed Layer 5: Generated ${topClips.length} perfectly aligned clips!`);
        return topClips;
    }
    async proofreadTranscript(transcript) {
        this.logger.log(`[LAYER 16] The Proofreader (Correcting Speech-to-Text typos)...`);
        const CHUNK_SIZE = 30;
        let correctedTranscript = [];
        for (let i = 0; i < transcript.length; i += CHUNK_SIZE) {
            const chunk = transcript.slice(i, i + CHUNK_SIZE);
            const chunkJson = JSON.stringify(chunk, null, 2);
            this.logger.log(`Proofreading chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(transcript.length / CHUNK_SIZE)}...`);
            const prompt = `Anda adalah Editor Bahasa Indonesia tingkat lanjut. 
Berikut adalah hasil transkripsi audio (JSON) yang masih kotor dan banyak salah eja (typo).
Tugas Anda adalah memperbaiki tata bahasa, kapitalisasi, dan ejaan teks tersebut menjadi Bahasa Indonesia baku/gaul yang tepat secara konteks, TANPA mengubah nilai "start" dan "end".

Aturan:
1. Perbaiki typo (contoh: "halo gays" -> "Halo guys").
2. Jangan hapus atau tambah segmen array. Jumlah item harus sama.
3. KEMBALIKAN HANYA JSON ARRAY VALID. TANPA markdown, TANPA penjelasan.

Data Input:
${chunkJson}`;
            try {
                const response = await this.fetchWithRetry(this.OLLAMA_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: this.MODEL,
                        prompt: prompt,
                        stream: false,
                        format: 'json'
                    }),
                }, 3, 1200000);
                const data = await response.json();
                let responseText = data.response;
                if (responseText.includes('</think>')) {
                    responseText = responseText.split('</think>')[1].trim();
                }
                const parsedChunk = JSON.parse(responseText);
                if (Array.isArray(parsedChunk) && Math.abs(parsedChunk.length - chunk.length) < 5) {
                    correctedTranscript.push(...parsedChunk);
                }
                else {
                    this.logger.warn(`Proofreader returned invalid length (Expected ${chunk.length}, got ${parsedChunk?.length}). Falling back to original chunk.`);
                    correctedTranscript.push(...chunk);
                }
            }
            catch (error) {
                this.logger.error(`Proofreader failed on chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error.message}. Using original chunk.`);
                correctedTranscript.push(...chunk);
            }
        }
        this.logger.log(`[LAYER 16] Proofreading complete! Processed ${correctedTranscript.length} segments.`);
        if (correctedTranscript.length > transcript.length * 0.8) {
            return correctedTranscript;
        }
        else {
            this.logger.warn(`Proofreader lost too many segments. Falling back to original transcript.`);
            return transcript;
        }
    }
};
exports.OllamaService = OllamaService;
exports.OllamaService = OllamaService = OllamaService_1 = __decorate([
    (0, common_1.Injectable)()
], OllamaService);
//# sourceMappingURL=ollama.service.js.map