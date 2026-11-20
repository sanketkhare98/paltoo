import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../contexts/PetContext';
import { geminiService } from '../../services/geminiService';
import { voiceService } from '../../services/voiceService';
import { PROMPTS } from '../../utils/prompts';
import { 
  Send, 
  Bot, 
  Sparkles, 
  PlusCircle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Square,
  Stethoscope
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

export default function AiChat() {
  const { canUseAi, incrementAiUsage, currentTier } = useAuth();
  const { activePet } = usePets();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVetVoiceEnabled, setIsVetVoiceEnabled] = useState(() => {
    return localStorage.getItem('paltoo_vet_voice_enabled') !== 'false';
  });
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);

  const messagesEndRef = useRef(null);

  const suggestions = [
    'Diet & nutrition advice 🍎',
    'Vaccination & wellness check 🩺',
    'Excessive itching or shedding 🐾',
    'Puppy / Kitten training tips 🎓',
    'Is chocolate or onions toxic? ⚠️'
  ];

  // Initialize initial greeting from Dr. Paltoo
  useEffect(() => {
    if (activePet && messages.length === 0) {
      const initialGreeting = `Hello! I'm Dr. Paltoo 🐾, your AI veterinary consultant. How is ${activePet.name} (${activePet.breed || activePet.species}) feeling today? You can type or tap the microphone to speak with me!`;
      const initialId = Date.now().toString();

      setMessages([
        {
          id: initialId,
          text: initialGreeting,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [activePet, messages.length]);

  // Sync vet voice preference
  useEffect(() => {
    localStorage.setItem('paltoo_vet_voice_enabled', isVetVoiceEnabled);
    if (!isVetVoiceEnabled) {
      voiceService.stopSpeaking();
      setCurrentlySpeakingId(null);
    }
  }, [isVetVoiceEnabled]);

  // Clean up ongoing speech on unmount
  useEffect(() => {
    return () => {
      voiceService.stopSpeaking();
      voiceService.stopListening();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Speak text using VoiceService
  const speakMessage = useCallback((text, messageId) => {
    if (!voiceService.isSpeechSynthesisSupported()) {
      showToast('Text-to-speech is not supported in this browser.', 'warning');
      return;
    }

    setCurrentlySpeakingId(messageId);
    voiceService.speak(text, {
      onStart: () => setCurrentlySpeakingId(messageId),
      onEnd: () => setCurrentlySpeakingId(null),
      onError: () => setCurrentlySpeakingId(null)
    });
  }, [showToast]);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
    setCurrentlySpeakingId(null);
  }, []);

  // Handle Speech-to-Text Voice Input
  const toggleVoiceInput = () => {
    if (!voiceService.isSpeechRecognitionSupported()) {
      showToast('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    // Stop ongoing audio before listening
    voiceService.stopSpeaking();
    setCurrentlySpeakingId(null);

    const started = voiceService.startListening({
      onInterim: (interim) => {
        setInputValue(interim);
      },
      onResult: (final) => {
        setInputValue(final);
        setIsListening(false);
        // Automatically send after voice input
        if (final.trim()) {
          handleSend(final.trim());
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        if (err?.error === 'not-allowed') {
          showToast('Microphone access was denied. Please allow microphone permissions in browser settings.', 'warning');
        } else if (err?.error !== 'no-speech') {
          showToast('Could not recognize voice. Please try again.', 'info');
        }
      }
    });

    if (started) {
      setIsListening(true);
      showToast('Listening... Speak now 🎙️', 'info');
    }
  };

  const handleSend = async (text) => {
    const messageText = text || inputValue.trim();
    if (!messageText || loading) return;

    if (!canUseAi()) {
      showToast('You have reached your daily AI limit. Upgrade to Paltoo Premium for unlimited consults.', 'warning');
      return;
    }

    // Stop listening and speaking
    voiceService.stopListening();
    setIsListening(false);
    voiceService.stopSpeaking();
    setCurrentlySpeakingId(null);

    const newUserMsg = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setLoading(true);

    try {
      // Build conversation context from previous messages
      const contextMessages = messages.slice(-5).map(m => `${m.isUser ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
      
      const prompt = PROMPTS.chatResponse(
        activePet || { species: 'Dog', name: 'your pet' },
        messageText,
        contextMessages,
        isVetVoiceEnabled // Pass voice mode flag to prompt for spoken conversational cadence
      );

      const responseText = await geminiService.chat(prompt);
      const newAiMsgId = (Date.now() + 1).toString();
      
      const newAiMsg = {
        id: newAiMsgId,
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMsg]);
      incrementAiUsage();

      // If Vet Voice output mode is enabled, speak the answer aloud automatically!
      if (isVetVoiceEnabled) {
        speakMessage(responseText, newAiMsgId);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I'm experiencing a brief connection delay. Please consult your local vet clinic for urgent care, or ask me again in a moment! 🐾",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!activePet) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-brand-100 text-brand-500 flex items-center justify-center mx-auto mb-4 shadow-sm animate-paw-bounce text-2xl">
          🐾
        </div>
        <h2 className="text-2xl font-display font-bold mb-2 text-[var(--color-text)]">Select or Add a Pet</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 text-sm max-w-sm">
          Please select an active pet profile so Dr. Paltoo can provide personalized veterinary advice.
        </p>
        <button onClick={() => navigate('/onboard-pet')} className="btn-primary flex items-center gap-2">
          <PlusCircle size={18} /> Add Pet Profile
        </button>
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col h-[calc(100vh-95px)] md:h-[calc(100vh-80px)] max-w-4xl mx-auto py-3 px-2 sm:px-4">
      
      {/* Header with Title and Voice Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
        <div>
          <h1 className="text-2xl font-display font-black text-[var(--color-text)] flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm shadow-sm">
              <Stethoscope size={18} />
            </span>
            <span>Dr. Paltoo's Vet Consult</span>
            <Sparkles size={18} className="text-brand-500" />
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Consultation for <strong className="text-[var(--color-text)]">{activePet.name}</strong> ({activePet.breed || activePet.species})
          </p>
        </div>

        {/* Voice Feature Options Toolbar */}
        <div className="flex items-center gap-2">
          
          {/* Active Speaking Wave & Stop button */}
          {currentlySpeakingId && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 animate-fade-in"
              title="Stop current voice playback"
            >
              <Square size={12} className="fill-current" />
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>Stop Voice</span>
            </button>
          )}

          {/* Vet Voice Auto-Read Toggle Pill */}
          <button
            type="button"
            onClick={() => {
              setIsVetVoiceEnabled(!isVetVoiceEnabled);
              showToast(!isVetVoiceEnabled ? 'Vet Voice Consult enabled 🩺' : 'Vet Voice Consult muted', 'info');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all shadow-sm active:scale-95 ${
              isVetVoiceEnabled 
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700/60' 
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-brand-300'
            }`}
            title="Toggle Dr. Paltoo spoken veterinary audio answers"
          >
            {isVetVoiceEnabled ? (
              <>
                <Volume2 size={14} className="text-brand-500" />
                <span>Vet Voice: ON</span>
              </>
            ) : (
              <>
                <VolumeX size={14} className="text-gray-400" />
                <span>Vet Voice: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative rounded-3xl border border-[var(--color-border)] shadow-sm">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 chat-scroll space-y-4">
          {messages.map(msg => (
            <ChatMessage 
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              onSpeak={(text) => speakMessage(text, msg.id)}
              isSpeakingThis={currentlySpeakingId === msg.id}
              onStopSpeak={stopSpeaking}
            />
          ))}

          {/* AI Thinking indicator */}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm p-4 text-[var(--color-text)] flex items-center gap-2.5 shadow-sm">
                <Bot size={18} className="text-brand-500 animate-pulse" />
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Dr. Paltoo is analyzing {activePet.name}'s query...
                </span>
                <div className="flex gap-1 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        {messages.length < 4 && !loading && !isListening && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 border border-[var(--color-border)] rounded-full text-xs font-medium transition-all text-[var(--color-text)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Active Listening Audio Wave Banner */}
        {isListening && (
          <div className="bg-gradient-to-r from-amber-500 via-brand-500 to-orange-500 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold animate-slide-up shadow-inner">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <span>Listening to your voice... Speak your question for Dr. Paltoo</span>
            </div>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-extrabold uppercase transition-colors"
            >
              Stop & Send
            </button>
          </div>
        )}

        {/* Input & Voice Controls Footer Bar */}
        <div className="p-3 sm:p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] bg-opacity-95 backdrop-blur-md">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            {/* Microphone Voice-to-Text Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={loading}
              className={`p-3 rounded-2xl transition-all shadow-sm active:scale-95 shrink-0 ${
                isListening 
                  ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse ring-4 ring-rose-400/30' 
                  : 'bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800'
              }`}
              title={isListening ? "Stop listening" : "Speak to Dr. Paltoo with Voice"}
              aria-label={isListening ? "Stop listening" : "Speak your message"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Transcribing your voice..." : "Ask Dr. Paltoo about symptoms, diet, behavior, or tap 🎙️ to speak..."}
              className="input-field flex-1 m-0 text-sm shadow-sm rounded-2xl"
              disabled={loading}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white p-3 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 shrink-0"
              title="Send message"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
