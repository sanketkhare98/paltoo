import React from 'react';
import { MARKETPLACE_CATEGORIES } from '../../utils/constants';
import { classNames } from '../../utils/helpers';

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [{ id: 'All', label: 'All', icon: '🐾' }, ...MARKETPLACE_CATEGORIES];

  return (
    <div className="overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-2 w-max">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={classNames(
              "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all shadow-sm",
              selectedCategory === cat.id
                ? "bg-brand-500 text-white shadow-brand-500/30"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
