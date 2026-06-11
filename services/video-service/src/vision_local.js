const fs = require('fs');

async function processVision() {
    try {
        const imagePath = process.argv[2];

        if (!fs.existsSync(imagePath)) {
            console.log(JSON.stringify({ success: false, error: 'File not found' }));
            process.exit(1);
        }

        // Dynamically import pipeline from transformers
        const { pipeline, env } = await import('@xenova/transformers');
        env.allowLocalModels = true; // Use locally cached models if available

        // Initialize Zero-Shot Image Classification (CLIP)
        const classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');

        const candidateLabels = [
            'angry person', 'laughing person', 'crying person', 'serious conversation',
            'podcast studio', 'outdoor interview', 'car interior', 'gadget review',
            'food tasting', 'action scene', 'sports', 'dancing', 'gaming'
        ];

        // Run zero-shot classification
        const results = await classifier(imagePath, candidateLabels);

        // Map English labels to Indonesian B-Roll/Semantic Tags
        const labelMap = {
            'angry person': 'Orang Marah',
            'laughing person': 'Tertawa',
            'crying person': 'Menangis',
            'serious conversation': 'Diskusi Serius',
            'podcast studio': 'Podcast Studio',
            'outdoor interview': 'Wawancara Outdoor',
            'car interior': 'Di Dalam Mobil',
            'gadget review': 'Review Gadget',
            'food tasting': 'Makan/Kuliner',
            'action scene': 'Adegan Aksi',
            'sports': 'Olahraga',
            'dancing': 'Menari',
            'gaming': 'Bermain Game'
        };

        // Get top 3 tags
        const topTags = results.slice(0, 3).map(r => labelMap[r.label] || r.label);

        console.log(JSON.stringify({ 
            success: true, 
            tags: topTags
        }));

    } catch (e) {
        console.log(JSON.stringify({ success: false, error: e.message }));
    }
}

processVision();
