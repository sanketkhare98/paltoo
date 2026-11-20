import React from 'react';
import { classNames } from '../../utils/helpers';

export default function PetAvatar({ species, size = 'md', className }) {
  const emojiMap = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
    rabbit: '🐇',
    hamster: '🐹',
    fish: '🐠'
  };

  const colorMap = {
    dog: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    cat: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    bird: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    rabbit: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    hamster: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    fish: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-24 h-24 text-6xl'
  };

  const speciesKey = (species || '').toLowerCase();
  const emoji = emojiMap[speciesKey] || '🐾';
  const colors = colorMap[speciesKey] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

  return (
    <div className={classNames('flex items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800 flex-shrink-0', colors, sizeClasses[size], className)}>
      <span role="img" aria-label={species || 'Pet'}>{emoji}</span>
    </div>
  );
}
