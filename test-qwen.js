const body = {
    model: 'qwen2.5:32b',
    prompt: 'Kamu adalah AI Video Editor. Buatkan 2 judul video TikTok viral berbahasa gaul Indonesia (slang) tentang investasi saham pemula. Berikan jawaban super singkat tanpa penjelasan.',
    stream: false
};

console.log("Memanggil Qwen 32B... (Harap tunggu, model sedang dimuat ke VRAM & RAM)...");
const start = Date.now();

fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
}).then(res => res.json()).then(data => {
    const end = Date.now();
    const durationSec = (end - start) / 1000;
    const evalDur = data.eval_duration / 1000000000;
    const speed = data.eval_count / evalDur;
    console.log("\n--- JAWABAN QWEN 32B ---");
    console.log(data.response.trim());
    console.log("\n--- STATISTIK KECEPATAN BENCHMARK ---");
    console.log(`Kecepatan Menulis   : ${speed.toFixed(2)} token/detik`);
    console.log(`Waktu Tunggu Total  : ${durationSec.toFixed(2)} detik`);
}).catch(console.error);
