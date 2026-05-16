"use client";

import React, { useState, useRef, useEffect } from "react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(20).fill(10));
  const [heatmapOpacity, setHeatmapOpacity] = useState<number[]>(Array(32).fill(0));
  const [confidenceValues, setConfidenceValues] = useState<number[]>(Array(3).fill(0));
  // Use deterministic initial values to avoid SSR/client hydration mismatch
  const [vocalPrintGrid, setVocalPrintGrid] = useState<boolean[]>(Array(16).fill(false));
  const [vocalPrintID, setVocalPrintID] = useState<string>("------");
  const [frequencyMonitorHeights, setFrequencyMonitorHeights] = useState<number[]>(Array(15).fill(50));

  useEffect(() => {
    // Initialize random values only on client after hydration
    setVocalPrintGrid(Array(16).fill(false).map(() => Math.random() > 0.5));
    setVocalPrintID(Math.random().toString(36).substring(7).toUpperCase());
    setFrequencyMonitorHeights(Array(15).fill(0).map(() => Math.random() * 80 + 20));

    const interval = setInterval(() => {
      setHeatmapOpacity(Array.from({length: 32}, () => Math.random()));
      setConfidenceValues(['CNN_L1', 'CNN_L2', 'HYBRID_FUSION'].map(() => Math.floor(Math.random() * 20 + 80)));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  // Handle Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setResult(null);
      setAudioURL(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Gagal mengakses mikrofon. Pastikan izin telah diberikan.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVisualizerData(Array(20).fill(10));
    }
  };

  // Mock Visualizer Animation
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setVisualizerData(Array.from({ length: 20 }, () => Math.random() * 80 + 10));
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle Analysis Simulation
  const handleAnalyze = () => {
    if (!selectedFile && !audioBlob) {
      alert("Silakan upload file atau rekam suara terlebih dahulu.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI Analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      const isFake = Math.random() > 0.5;
      setResult({
        label: isFake ? "FAKE (DEEPFAKE)" : "REAL (ASLI)",
        confidence: Math.floor(Math.random() * 20) + 80 // 80-99%
      });
      
      // Scroll to result
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-[#C92712] selection:text-white overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C92712] opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C92712] opacity-10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-0 pb-12 lg:px-20">
        {/* Header / Nav - Restored */}
        <header className="flex justify-between items-center mb-0 py-4 relative z-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#C92712] border-2 border-white flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              A
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              AudioGuardAI
            </span>
          </div>
          <div className="hidden md:flex gap-8 font-bold uppercase text-sm tracking-widest text-white">
            <a href="#cara-kerja" className="hover:text-[#C92712] transition-colors">Cara Kerja</a>
            <a href="#teknologi" className="hover:text-[#C92712] transition-colors">Teknologi</a>
          </div>
        </header>

        {/* Hero Section - Titan-Grade Neural Interface (Pushed Up) */}
        <section className="relative flex flex-col items-center justify-start min-h-[80vh] mb-24 -mt-16 pt-0 overflow-visible perspective-1000 z-10">
          {/* Neural Matrix Background */}
          <div className="absolute inset-0 -z-20">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C92712_1px,transparent_1px)] bg-size-[30px_30px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
            
            {/* Moving Light Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C92712]/20 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C92712]/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
          </div>

          {/* Ultra-Detail HUD Elements (Left) */}
          <div className="absolute left-6 top-1/3 hidden 2xl:flex flex-col gap-8 w-72 pointer-events-none">
            {/* Spectral Heatmap Widget */}
            <div className="bg-black/80 backdrop-blur-2xl border-2 border-white/5 p-4 shadow-[10px_10px_0px_0px_rgba(201,39,18,0.3)]">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#C92712]">Spectral_Heatmap</p>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
               <div className="grid grid-cols-8 gap-1">
                 {[...Array(32)].map((_, i) => (
                   <div key={i} className="h-4 w-full bg-[#C92712]" style={{ opacity: heatmapOpacity[i] }}></div>
                 ))}
               </div>
              <p className="mt-3 text-[8px] font-mono text-zinc-600">RESOLUTION: 24-BIT / 192KHZ</p>
            </div>

             {/* Neural Confidence Matrix */}
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rotate-[-1deg]">
               <p className="text-[9px] font-black text-zinc-500 uppercase mb-4 tracking-[0.2em]">Confidence_Matrix</p>
               <div className="space-y-3">
                 {['CNN_L1', 'CNN_L2', 'HYBRID_FUSION'].map((label, i) => (
                   <div key={i} className="space-y-1">
                     <div className="flex justify-between text-[8px] font-bold">
                       <span>{label}</span>
                       <span>{confidenceValues[i]}%</span>
                     </div>
                     <div className="w-full h-1 bg-zinc-800">
                       <div className="h-full bg-[#C92712]" style={{ width: `${confidenceValues[i] * 0.3 + 70}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          {/* Ultra-Detail HUD Elements (Right) */}
          <div className="absolute right-6 top-1/3 hidden 2xl:flex flex-col gap-8 w-72 pointer-events-none items-end">
            {/* Vocal Print ID */}
            <div className="bg-[#111] border-2 border-[#C92712] p-5 shadow-[12px_12px_0px_0px_white] rotate-[2deg]">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 bg-white/10 border border-white/20 flex flex-wrap p-1">
                  {vocalPrintGrid.map((isOn, i) => (
                    <div key={i} className={`w-1/4 h-1/4 border-[0.5px] border-black/50 ${isOn ? 'bg-[#C92712]' : 'bg-transparent'}`}></div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase italic">Vocal_Print_ID</p>
                  <p className="text-[8px] text-zinc-500 font-mono mt-1">S_ID: {vocalPrintID}</p>
                  <p className="text-[8px] text-zinc-500 font-mono">STATUS: VERIFIED</p>
                </div>
              </div>
            </div>

            {/* Real-time Frequency Monitor */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 w-full">
              <p className="text-[9px] font-black uppercase text-right text-zinc-400 mb-2 tracking-widest">Live_Freq_Monitor</p>
              <div className="h-20 flex items-center justify-center gap-1">
                {frequencyMonitorHeights.map((h, i) => (
                  <div key={i} className="w-2 bg-gradient-to-t from-[#C92712] to-white/20" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Titan Core Interface (Main Body) */}
          <div className="relative z-10 w-full max-w-7xl px-8 transform-gpu rotate-x-12 rotate-y-[-2deg]">
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-white/5 p-12 md:p-24 overflow-hidden">
              {/* Animated Scan Bar */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#C92712] animate-[scan-vertical_6s_linear_infinite] shadow-[0_0_20px_#C92712] opacity-50"></div>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white opacity-20"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#C92712] opacity-40"></div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-10 group cursor-help">
                  <div className="w-12 h-[1px] bg-[#C92712]"></div>
                  <span className="text-[12px] font-black uppercase tracking-[0.8em] text-[#C92712] animate-pulse">Neural Guard Protocol Active</span>
                  <div className="w-12 h-[1px] bg-[#C92712]"></div>
                </div>

                <h1 className="flex flex-col items-center text-6xl md:text-[8rem] font-black leading-none uppercase italic tracking-tighter text-center mb-12">
                  <span className="text-[#C92712] drop-shadow-[0_0_50px_rgba(201,39,18,0.3)] z-10">
                    Deteksi
                  </span>
                  <span className="text-[#C92712] drop-shadow-[0_0_60px_rgba(201,39,18,0.4)] z-10 -mt-2 md:-mt-6">
                    Audio
                  </span>
                  <span className="text-[#C92712] drop-shadow-[0_0_80px_rgba(201,39,18,0.7)] hover:tracking-normal transition-all duration-500 cursor-default -mt-2 md:-mt-6 relative z-0">
                    Deepfake
                  </span>
                  <span className="text-xl md:text-4xl bg-white text-black px-6 py-2 inline-block transform -skew-x-12 mt-1 md:mt-2 shadow-[12px_12px_0px_0px_#C92712] tracking-wide font-black relative z-10">
                    Dengan Kecerdasan Buatan
                  </span>
                </h1>

                <p className="text-xl md:text-3xl text-zinc-500 mb-20 max-w-5xl text-center leading-[1.2] font-bold">
                  Upload file audio atau rekam suara langsung — 
                  <span className="text-white"> AI kami akan menganalisis keaslian audio </span> 
                  dalam hitungan detik.
                </p>

                <div className="flex flex-col md:flex-row gap-10 items-center justify-center w-full">
                  <button 
                    onClick={() => document.getElementById('detection-tool')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group relative w-full md:w-auto overflow-hidden px-24 py-10 bg-black text-white font-black text-4xl uppercase italic border-4 border-[#C92712] shadow-[20px_20px_0px_0px_white] hover:shadow-none hover:translate-x-[20px] hover:translate-y-[20px] transition-all"
                  >
                    <div className="absolute inset-0 bg-[#C92712] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative z-10 group-hover:text-black transition-colors">Start Verification</span>
                  </button>

                  <div className="grid grid-cols-2 gap-8 border-l-4 border-white/10 pl-10 md:grid">
                    <div>
                      <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Session_Token</p>
                      <p className="text-xl font-black italic">TR-9902-X</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Secure_Level</p>
                      <p className="text-xl font-black italic text-[#C92712]">MAXIMUM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Technical Banner (Bottom) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[100vw] overflow-hidden bg-white text-black py-4 -rotate-2 scale-105 z-20">
            <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="text-2xl font-black uppercase italic mx-12">
                  AUTHENTICATE YOUR VOICE — DETECT MANIPULATION — SECURE THE FUTURE — NO DEEPFAKES — 
                </span>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes scan-vertical {
              0% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
            @keyframes shine {
              0% { transform: translateX(-100%) skewX(-30deg); }
              100% { transform: translateX(200%) skewX(-30deg); }
            }
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .border-text-white-titan {
              -webkit-text-stroke: 2px rgba(255,255,255,0.4);
              color: transparent;
            }
            .perspective-1000 {
              perspective: 1500px;
            }
            .rotate-x-12 {
              transform: rotateX(8deg);
            }
          `}</style>
        </section>

        {/* Main Section - Detection Tool */}
        <section id="detection-tool" className="mb-32 max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-1 md:p-2 shadow-[12px_12px_0px_0px_#C92712]">
            <div className="bg-[#111] border border-white/10">
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 py-4 font-black uppercase italic tracking-wider transition-all ${activeTab === "upload" ? "bg-[#C92712] text-white" : "hover:bg-white/5 text-zinc-500"}`}
                >
                  Upload File
                </button>
                <button 
                  onClick={() => setActiveTab("record")}
                  className={`flex-1 py-4 font-black uppercase italic tracking-wider transition-all ${activeTab === "record" ? "bg-[#C92712] text-white" : "hover:bg-white/5 text-zinc-500"}`}
                >
                  Rekam Suara
                </button>
              </div>

              <div className="p-8">
                {activeTab === "upload" ? (
                  <div className="space-y-6">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept=".mp3,.wav,.ogg,.flac,.m4a,.aac,.webm" 
                      className="hidden" 
                    />
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed p-12 text-center group transition-colors cursor-pointer ${selectedFile ? "border-[#C92712] bg-[#C92712]/5" : "border-white/20 bg-white/5 hover:border-[#C92712]"}`}
                    >
                      <div className="mb-4 flex justify-center">
                        <svg className={`w-16 h-16 transition-colors ${selectedFile ? "text-[#C92712]" : "text-zinc-500 group-hover:text-[#C92712]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-xl font-bold mb-2 uppercase italic">
                        {selectedFile ? selectedFile.name : "Drag & drop file audio di sini"}
                      </p>
                      <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                        {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Atau pilih file dari perangkat"}
                      </p>
                      {selectedFile && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                          className="mt-4 text-[#C92712] text-xs font-black uppercase underline"
                        >
                          Hapus File
                        </button>
                      )}
                      {!selectedFile && (
                        <p className="mt-6 text-xs text-zinc-600 font-bold uppercase tracking-widest">
                          MP3, WAV, OGG, FLAC, M4A, AAC, WebM — Maks. 10 MB
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 flex flex-col items-center py-6">
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-24 h-24 rounded-full border-4 border-white flex items-center justify-center transition-all shadow-[0_0_30px_rgba(201,39,18,0.5)] ${isRecording ? "bg-white animate-pulse" : "bg-[#C92712] hover:scale-105"}`}
                    >
                      {isRecording ? (
                        <div className="w-8 h-8 bg-[#C92712] rounded-sm"></div>
                      ) : (
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                      )}
                    </button>
                    
                    <p className="font-black uppercase italic tracking-widest text-[#C92712]">
                      {isRecording ? "Sedang Merekam..." : "Siap Merekam"}
                    </p>

                    <div className="w-full h-24 bg-white/5 border border-white/10 flex items-center justify-center gap-1 px-4">
                      {visualizerData.map((height, i) => (
                        <div 
                          key={i} 
                          className="w-2 bg-[#C92712] transition-all duration-100" 
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>

                    {audioURL && (
                      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase italic tracking-tighter">Hasil_Rekaman.wav</p>
                              <p className="text-[10px] text-zinc-500 uppercase font-bold">Siap dianalisis</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => { setAudioURL(null); setAudioBlob(null); }}
                            className="text-zinc-400 hover:text-[#C92712] transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <audio src={audioURL ?? undefined} controls className="w-full h-8 brightness-90 contrast-125" />
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/10">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || (!selectedFile && !audioBlob)}
                    className={`w-full py-5 bg-white text-black font-black text-xl uppercase italic border-2 border-black shadow-[6px_6px_0px_0px_#C92712] transition-all relative overflow-hidden ${isAnalyzing || (!selectedFile && !audioBlob) ? "opacity-50 cursor-not-allowed" : "hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"}`}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menganalisis...
                      </span>
                    ) : "Analisis Sekarang"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Result Section */}
        {result !== null && (() => {
          const { label, confidence } = result;
          const isFake = label.includes("FAKE");
          return (
            <section id="result-section" className="mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className={`p-1 border-4 shadow-[12px_12px_0px_0px_white] ${isFake ? "border-[#C92712] bg-[#C92712]/10" : "border-green-500 bg-green-500/10"}`}>
                <div className="bg-black p-8 md:p-12 text-center border-2 border-white/10">
                  <h2 className="text-2xl font-black uppercase italic text-zinc-500 mb-2">Hasil Analisis AI</h2>
                  <div className={`text-5xl md:text-7xl font-black uppercase italic mb-6 tracking-tighter ${isFake ? "text-[#C92712]" : "text-green-500"}`}>
                    {label}
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full max-w-md h-4 bg-zinc-900 border border-white/20">
                      <div
                        className={`h-full transition-all duration-1000 ${isFake ? "bg-[#C92712]" : "bg-green-500"}`}
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-xl font-bold uppercase italic tracking-widest">
                      Confidence: <span className="text-white">{confidence}%</span>
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedFile(null); setAudioBlob(null); setAudioURL(null); setResult(null); }}
                    className="mt-12 px-8 py-3 bg-white text-black font-black uppercase italic border-2 border-black hover:bg-zinc-200 transition-colors"
                  >
                    Cek Audio Lain
                  </button>
                </div>
              </div>
            </section>
          );
        })()}

        {/* How It Works Section */}
        <section id="cara-kerja" className="mb-32">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Bagaimana Cara Kerjanya?</h2>
            <div className="w-24 h-2 bg-[#C92712]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload atau Rekam",
                desc: "Upload file audio (MP3, WAV, dll.) atau rekam suara langsung dari mikrofon browser Anda."
              },
              {
                step: "02",
                title: "Analisis AI",
                desc: "Model Hybrid CNN menganalisis waveform dan MFCC audio untuk mendeteksi pola deepfake."
              },
              {
                step: "03",
                title: "Lihat Hasil",
                desc: "Dapatkan hasil instan: apakah audio tersebut Real (asli) atau Fake (deepfake) beserta tingkat kepercayaan."
              }
            ].map((item, index) => (
              <div key={index} className="group relative bg-white/5 backdrop-blur-md border-2 border-white/10 p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] hover:border-[#C92712] transition-all">
                <div className="text-6xl font-black text-[#C92712]/20 group-hover:text-[#C92712]/40 absolute top-4 right-6 transition-colors leading-none">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-4 relative z-10">{item.title}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section id="teknologi" className="mb-32">
          <div className="bg-[#C92712] p-12 border-4 border-white shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]">
            <div className="mb-12">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">Teknologi di Balik Deteksi</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "1D CNN — Waveform",
                  desc: "Menganalisis pola gelombang mentah (raw waveform) audio untuk mendeteksi artefak yang tidak terdengar oleh telinga manusia."
                },
                {
                  title: "2D CNN — MFCC",
                  desc: "Mengekstrak fitur frekuensi (Mel-Frequency Cepstral Coefficients) untuk mengenali karakteristik suara sintetis."
                },
                {
                  title: "Hybrid Fusion",
                  desc: "Menggabungkan kedua fitur untuk klasifikasi akhir yang lebih akurat dibandingkan metode tunggal."
                }
              ].map((tech, index) => (
                <div key={index} className="bg-black/90 p-8 border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                  <h3 className="text-xl font-black uppercase italic text-[#C92712] mb-4">{tech.title}</h3>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 border-t border-white/10 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#C92712] border-2 border-white flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  A
                </div>
                <span className="text-lg font-black tracking-tighter uppercase italic">
                  AudioGuardAI
                </span>
              </div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
                Audio Deepfake Detector — Powered by Hybrid CNN Model on HuggingFace Spaces
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="p-3 bg-white/5 border border-white/10 hover:border-[#C92712] transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="p-3 bg-white/5 border border-white/10 hover:border-[#C92712] transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
          <div className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 AudioGuardAI. All Rights Reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
