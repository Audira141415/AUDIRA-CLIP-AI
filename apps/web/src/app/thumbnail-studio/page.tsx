// @ts-nocheck
'use client';
import { useState, useEffect, useRef } from 'react';

export default function ThumbnailStudio() {
  const [selectedStyle, setSelectedStyle] = useState('neon');
  const [textInput, setTextInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import fabric to avoid SSR issues
    import('fabric').then(({ fabric }) => {
      if (canvasRef.current && !fabricCanvasRef.current) {
        // Initialize fabric canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 800,
          height: 450,
          backgroundColor: '#111827'
        });
        fabricCanvasRef.current = canvas;

        // Add default text
        const text = new fabric.Text('Viral Thumbnail', {
          left: 400,
          top: 225,
          originX: 'center',
          originY: 'center',
          fontFamily: 'Inter',
          fontSize: 64,
          fill: '#fff',
          fontWeight: 'bold',
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.8)',
            blur: 10,
            offsetX: 5,
            offsetY: 5
          })
        });
        canvas.add(text);
      }
    });

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  const handleAddText = () => {
    if (!fabricCanvasRef.current || !textInput) return;
    import('fabric').then(({ fabric }) => {
      const text = new fabric.Text(textInput, {
        left: 400,
        top: 225,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Inter',
        fontSize: 48,
        fill: selectedStyle === 'neon' ? '#00ffcc' : '#fff',
        fontWeight: 'bold',
      });
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      setTextInput('');
    });
  };

  const handleExport = () => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    });
    const link = document.createElement('a');
    link.download = 'audira-thumbnail.png';
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Thumbnail Studio
          </h1>
          <p className="text-gray-400 mt-2">Design high-converting thumbnails using AI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden relative flex items-center justify-center p-4">
              <canvas ref={canvasRef} className="border border-white/10 rounded-xl" />
            </div>
            <div className="mt-4 flex gap-4">
              <button 
                onClick={handleExport}
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-medium transition-colors"
              >
                Export Thumbnail
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Preset Style</label>
              <div className="grid grid-cols-2 gap-3">
                {['Neon', 'Cyberpunk', 'Minimal', 'Hormozi'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style.toLowerCase())}
                    className={`py-2 rounded-lg border transition-all ${
                      selectedStyle === style.toLowerCase()
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-white/10 hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Add Text</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  onClick={handleAddText}
                  className="bg-white/10 hover:bg-white/20 px-4 rounded-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Background Subject</label>
              <div className="h-32 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-400 hover:border-white/40 transition-colors cursor-pointer">
                + Upload Image
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
