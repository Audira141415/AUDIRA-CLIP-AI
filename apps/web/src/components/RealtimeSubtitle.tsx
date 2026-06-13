'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Mic, Square, Loader2 } from 'lucide-react';

export default function RealtimeSubtitle() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3004', {
      autoConnect: false,
    });

    socketRef.current.on('connect', () => {
      setIsConnecting(false);
      console.log('Connected to Subtitle Service');
    });

    socketRef.current.on('transcript', (data: { text: string; is_final: boolean }) => {
      if (data.is_final) {
        setTranscript((prev) => prev + (prev ? ' ' : '') + data.text);
        setPartialTranscript('');
      } else {
        setPartialTranscript(data.text);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Subtitle Service');
      stopRecording();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsConnecting(true);
      socketRef.current?.connect();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      audioContextRef.current = audioContext;

      await audioContext.audioWorklet.addModule('/audio-processor.js');

      const source = audioContext.createMediaStreamSource(stream);
      const processor = new AudioWorkletNode(audioContext, 'pcm-processor');
      processorRef.current = processor;

      processor.port.onmessage = (e) => {
        // e.data is an ArrayBuffer containing Int16 PCM data
        if (socketRef.current?.connected) {
          socketRef.current.emit('audio_chunk', e.data);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      setIsConnecting(false);
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsConnecting(false);
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (socketRef.current?.connected) {
      socketRef.current.disconnect();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-800">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {isRecording && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isRecording ? 'bg-red-500' : 'bg-slate-500'}`}></span>
            </span>
            Real-Time Subtitle
          </h2>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isConnecting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isRecording
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : isRecording ? (
              <>
                <Square className="w-4 h-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Start Speaking
              </>
            )}
          </button>
        </div>

        <div className="min-h-[150px] p-4 bg-slate-950 rounded-lg border border-slate-800/50 relative overflow-hidden">
          {!transcript && !partialTranscript && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              {isRecording ? 'Listening...' : 'Click start and speak to see subtitles'}
            </div>
          )}
          
          <div className="text-lg leading-relaxed text-slate-300">
            {transcript}
            {partialTranscript && (
              <span className="text-blue-400 opacity-80 italic ml-1">
                {partialTranscript}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
