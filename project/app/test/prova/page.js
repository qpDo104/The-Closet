'use client';

import React, { useState, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Loader2, Sparkles, Shirt } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export default function Finto3DParallaxTest() {
  const [imageSrc, setImageSrc] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | processing | done
  const [isWearing, setIsWearing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // STATO PER LA CATEGORIA DEL CAPO
  const [category, setCategory] = useState('top'); 
  const fileInputRef = useRef(null);

  // CONFIGURAZIONE POSIZIONI IN BASE ALLA CATEGORIA
  const categoryConfig = {
    top: { label: 'Maglia / Giacca', top: '80px', width: '14rem' },
    bottom: { label: 'Pantaloni / Gonna', top: '210px', width: '12rem' },
    shoes: { label: 'Scarpe', top: '370px', width: '8rem' }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImage(file);
  };

  const processImage = async (file) => {
    try {
      setStatus('processing');
      setProgress(0);
      setIsWearing(false);
      
      // Utilizziamo il modello "isnet_quint8" (quantizzato a 8 bit).
      // Pesa circa 4MB anziché 40MB+, il che riduce drasticamente i tempi di caricamento!
      const blob = await removeBackground(file, {
        model: 'isnet_quint8', 
        progress: (key, current, total) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        }
      });
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
      setStatus('done');
    } catch (error) {
      console.error('Errore durante la rimozione dello sfondo:', error);
      alert('Si è verificato un errore. Riprova.');
      setStatus('idle');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processImage(file);
  };

  // SVG Data URI per la maschera CSS
  const svgMask = `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="40" r="35" /><path d="M50,100 Q100,85 150,100 L170,220 Q175,250 150,230 L135,160 L135,380 Q135,400 115,400 L105,400 L105,250 L95,250 L95,400 L85,400 Q65,400 65,380 L65,160 L50,230 Q25,250 30,220 Z" /></svg>')`;

  const maskStyle = {
    WebkitMaskImage: svgMask,
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskImage: svgMask,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 mb-4 drop-shadow-sm"
          >
            Finto 3D CSS Parallasse - V3
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            Ora con modello AI alleggerito (veloce) e posizionamento intelligente (scarpe, pantaloni, maglie).
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          
          {/* LEFT SIDE: Upload & 3D Card Area */}
          <div className="flex flex-col items-center justify-center w-full h-full">
            <AnimatePresence mode="wait">
              
              {/* UPLOAD STATE */}
              {status === 'idle' && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-md"
                >
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-slate-800 hover:border-blue-500/50 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-300 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer group shadow-2xl backdrop-blur-sm"
                  >
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                      <UploadCloud className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Carica un capo</h3>
                    <p className="text-slate-400 text-center text-sm leading-relaxed">
                      Trascina qui l'immagine o clicca per sfogliare.<br/>
                      L'IA rimuoverà lo sfondo istantaneamente.
                    </p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </motion.div>
              )}

              {/* PROCESSING STATE CON BARRA DI PROGRESSO */}
              {status === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-sm aspect-[3/4] flex flex-col items-center justify-center rounded-[2rem] border border-blue-500/20 bg-blue-900/5 shadow-[0_0_50px_rgba(59,130,246,0.1)] backdrop-blur-sm"
                >
                  <div className="relative">
                    <Loader2 className="w-14 h-14 text-blue-500 animate-spin mb-6" />
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                  </div>
                  <p className="text-blue-300 font-medium text-lg">Elaborazione IA...</p>
                  
                  {/* BARRA DI PROGRESSO REALE */}
                  <div className="w-full max-w-[200px] bg-slate-800 rounded-full h-2 mt-6 overflow-hidden border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-400 mt-2">{progress}% Completato</p>
                  
                  <p className="text-blue-400/50 text-xs mt-4 text-center px-6">
                    Al primo avvio scarica un modello AI leggero.<br/>I caricamenti successivi saranno istantanei.
                  </p>
                </motion.div>
              )}

              {/* DONE STATE: 3D PARALLAX CARD */}
              {status === 'done' && !isWearing && (
                <motion.div 
                  key="done"
                  layoutId="clothing-card"
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="w-full max-w-sm"
                >
                  <Tilt 
                    className="aspect-[3/4] rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/5 relative bg-gradient-to-b from-slate-800 to-slate-900"
                    glareEnable={true} 
                    glareMaxOpacity={0.4} 
                    glareColor="#ffffff" 
                    glarePosition="all"
                    glareBorderRadius="32px"
                    tiltMaxAngleX={25}
                    tiltMaxAngleY={25}
                    perspective={800}
                    scale={1.05}
                    transitionSpeed={1000}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem]"></div>
                    
                    <div 
                      className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none"
                      style={{ transform: 'translateZ(120px)' }}
                    >
                      <img 
                        src={imageSrc} 
                        alt="Capo elaborato" 
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    
                    <div 
                      className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none" 
                      style={{ transform: 'translateZ(60px)' }}
                    >
                      <div className="px-5 py-2.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-sm font-medium flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Sfondo Rimosso
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Mannequin Area */}
          <div className="flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800/50 rounded-[2rem] p-8 relative min-h-[600px] shadow-2xl overflow-hidden backdrop-blur-md">
            
            {/* SELETTORE CATEGORIA + BOTTONE INDOSSA */}
            <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-3">
              
              {/* Selettore categoria visibile solo se l'immagine è pronta */}
              <AnimatePresence>
                {status === 'done' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex bg-black/40 border border-slate-700/50 p-1 rounded-xl backdrop-blur-md"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <button 
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${category === key ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsWearing(!isWearing)}
                disabled={status !== 'done'}
                className="px-6 py-3 w-full justify-center bg-white text-black rounded-xl font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2"
              >
                <Shirt className="w-5 h-5" />
                {isWearing ? 'Riponi nell\'armadio' : 'Indossa sul manichino'}
              </button>
            </div>

            {/* Mannequin Silhouette */}
            <div className="relative w-64 h-[500px] flex justify-center mt-12 z-10">
              
              {/* SVG Omino di base (in background) */}
              <svg viewBox="0 0 200 400" className="w-full h-full text-slate-800/80 drop-shadow-2xl" fill="currentColor">
                <circle cx="100" cy="40" r="35" className="fill-slate-800/80" />
                <path d="M50,100 Q100,85 150,100 L170,220 Q175,250 150,230 L135,160 L135,380 Q135,400 115,400 L105,400 L105,250 L95,250 L95,400 L85,400 Q65,400 65,380 L65,160 L50,230 Q25,250 30,220 Z" />
              </svg>

              {/* The worn item INSIDE the mask */}
              <AnimatePresence>
                {isWearing && status === 'done' && (
                  <motion.div 
                    layoutId="clothing-card"
                    initial={{ opacity: 0, y: -40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.8 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={maskStyle} // Applica la maschera SVG al container!
                  >
                    <div className="w-full h-full relative flex justify-center">
                       {/* L'IMMAGINE SI POSIZIONA IN BASE ALLA CATEGORIA SELEZIONATA */}
                       <img 
                         src={imageSrc} 
                         alt="Capo indossato" 
                         className="absolute object-contain filter drop-shadow-lg transition-all duration-500 ease-out"
                         style={{ 
                           top: categoryConfig[category].top, 
                           width: categoryConfig[category].width 
                         }}
                       />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
