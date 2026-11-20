/**
 * Voice Service for Paltoo AI Pet Companion
 * Provides Web Speech API integration:
 * 1. Speech-to-Text (STT) via SpeechRecognition / webkitSpeechRecognition
 * 2. Text-to-Speech (TTS) via SpeechSynthesis tuned for an authoritative, caring veterinary consultant
 */

class VoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.voices = [];
    this.selectedVoice = null;
    this.onVoiceStateChange = null;

    if (this.synth) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
    
    // Priority order for natural, professional, caring veterinary voices
    const preferredNames = [
      'google uk english female',
      'google us english',
      'google uk english male',
      'microsoft aria online',
      'microsoft ryan online',
      'microsoft jenny online',
      'samantha',
      'karen',
      'daniel',
      'victoria',
      'serena'
    ];

    // Find best match among English voices
    for (const name of preferredNames) {
      const found = this.voices.find(v => 
        v.name.toLowerCase().includes(name) || 
        (v.lang.startsWith('en') && v.name.toLowerCase().includes(name.split(' ')[0]))
      );
      if (found) {
        this.selectedVoice = found;
        break;
      }
    }

    if (!this.selectedVoice) {
      this.selectedVoice = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }
  }

  isSpeechRecognitionSupported() {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  isSpeechSynthesisSupported() {
    return !!this.synth;
  }

  /**
   * Start listening for voice input
   */
  startListening({ onResult, onInterim, onEnd, onError }) {
    if (!this.isSpeechRecognitionSupported()) {
      onError?.(new Error('Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.'));
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript && onInterim) {
          onInterim(interimTranscript);
        }

        if (finalTranscript && onResult) {
          onResult(finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        onError?.(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      this.isListening = false;
      onError?.(err);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }
    this.isListening = false;
  }

  /**
   * Clean text for clean veterinary speech reading
   * Removes markdown syntax, emojis, bullets, and URL links
   */
  cleanTextForSpeech(text) {
    if (!text) return '';
    return text
      // Remove URLs
      .replace(/https?:\/\/\S+/gi, '')
      // Remove markdown bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove headers and bullets
      .replace(/#{1,6}\s+/g, '')
      .replace(/^[\s*-•]+\s+/gm, '')
      // Remove emojis
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}]/gu, '')
      // Remove markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Clean up multiple spaces and empty lines
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Speak veterinary response aloud
   */
  speak(text, { onStart, onEnd, onError } = {}) {
    if (!this.synth) {
      onError?.(new Error('Text to speech is not supported in this browser.'));
      return;
    }

    // Cancel any ongoing speech
    this.stopSpeaking();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) {
      onEnd?.();
      return;
    }

    try {
      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);

      // Apply selected veterinary consultant voice if available
      if (this.selectedVoice) {
        this.currentUtterance.voice = this.selectedVoice;
      }

      // Veterinary consultant acoustic parameters:
      // Rate: 0.94 (measured, calm, caring clinical pace)
      // Pitch: 1.0 (steady, reassuring, professional tone)
      this.currentUtterance.rate = 0.94;
      this.currentUtterance.pitch = 1.0;
      this.currentUtterance.volume = 1.0;

      this.currentUtterance.onstart = () => {
        onStart?.();
      };

      this.currentUtterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      this.currentUtterance.onerror = (e) => {
        // Ignore canceled errors
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis error:', e);
          onError?.(e);
        }
        this.currentUtterance = null;
        onEnd?.();
      };

      this.synth.speak(this.currentUtterance);
    } catch (err) {
      console.error('Failed to speak text:', err);
      onError?.(err);
      onEnd?.();
    }
  }

  stopSpeaking() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignore
      }
    }
    this.currentUtterance = null;
  }

  isSpeaking() {
    return !!(this.synth && this.synth.speaking);
  }
}

export const voiceService = new VoiceService();
