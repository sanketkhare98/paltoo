import React from 'react';
import { formatTime, classNames } from '../../utils/helpers';
import { Bot, User, Volume2, Square } from 'lucide-react';

export default function ChatMessage({ 
  message, 
  isUser, 
  timestamp, 
  onSpeak, 
  isSpeakingThis, 
  onStopSpeak 
}) {
  // Simple markdown parser for bold and lists
  const renderMessage = (text) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) return <br key={lineIndex} />;

      // Handle list items
      const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      let content = isListItem ? line.trim().substring(2) : line;

      // Handle bold text **text**
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIndex} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={partIndex}>{part}</span>;
      });

      if (isListItem) {
        return (
          <div key={lineIndex} className="flex gap-2 mt-1">
            <span className="text-brand-500 mt-1">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      return <div key={lineIndex} className={lineIndex > 0 ? "mt-2" : ""}>{renderedParts}</div>;
    });
  };

  return (
    <div className={classNames(
      "flex w-full animate-slide-up",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={classNames(
        "flex max-w-[88%] md:max-w-[78%] gap-2 md:gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className="shrink-0 flex items-end">
          <div className={classNames(
            "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
            isUser 
              ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300" 
              : isSpeakingThis
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-brand-500/30 scale-105"
                : "bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400 shadow-sm"
          )}>
            {isUser ? <User size={16} /> : <Bot size={18} />}
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className={classNames(
            "px-4 py-3 shadow-sm text-[15px] leading-relaxed break-words relative transition-all duration-300",
            isUser 
              ? "bg-brand-500 text-white rounded-2xl rounded-tr-sm" 
              : isSpeakingThis
                ? "bg-[var(--color-surface)] border-2 border-brand-400/80 shadow-md text-[var(--color-text)] rounded-2xl rounded-tl-sm ring-2 ring-brand-400/20"
                : "bg-[var(--color-surface)] border border-gray-100 dark:border-gray-800 text-[var(--color-text)] rounded-2xl rounded-tl-sm"
          )}>
            {renderMessage(message)}
          </div>

          {/* Footer: Timestamp & Voice Speaker Action */}
          <div className={classNames(
            "flex items-center gap-2 px-1 text-[11px] text-[var(--color-text-secondary)]",
            isUser ? "justify-end" : "justify-between"
          )}>
            <span>{formatTime(timestamp)}</span>

            {/* Read aloud in Vet Voice button for Assistant responses */}
            {!isUser && onSpeak && (
              <button
                type="button"
                onClick={() => {
                  if (isSpeakingThis) {
                    onStopSpeak?.();
                  } else {
                    onSpeak?.(message);
                  }
                }}
                className={classNames(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all",
                  isSpeakingThis 
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 ring-1 ring-brand-400" 
                    : "text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                )}
                title={isSpeakingThis ? "Stop Dr. Paltoo's voice" : "Listen to Dr. Paltoo in Vet Voice"}
                aria-label={isSpeakingThis ? "Stop speaking" : "Listen to response"}
              >
                {isSpeakingThis ? (
                  <>
                    <Square size={11} className="fill-current" />
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-3 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span>Speaking</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={12} />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
