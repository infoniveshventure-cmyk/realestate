'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CompareButtonProps {
  projectSlug: string;
  projectName: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function CompareButton({
  projectSlug,
  projectName,
  size = 'md',
  showLabel = true,
}: CompareButtonProps) {
  const router = useRouter();
  const [isComparing, setIsComparing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkIfComparing();
  }, [projectSlug]);

  function checkIfComparing() {
    try {
      const compare = localStorage.getItem('compare_projects');
      const projectIds = compare ? JSON.parse(compare) : [];
      setIsComparing(projectIds.includes(projectSlug));
    } catch (error) {
      console.error('Error checking comparison:', error);
    }
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const compare = localStorage.getItem('compare_projects');
      let projectIds = compare ? JSON.parse(compare) : [];

      if (isComparing) {
        projectIds = projectIds.filter((id: string) => id !== projectSlug);
        setIsComparing(false);
      } else {
        if (projectIds.length >= 3) {
          alert('You can compare a maximum of 3 properties at a time.');
          return;
        }
        projectIds.push(projectSlug);
        setIsComparing(true);
      }

      localStorage.setItem('compare_projects', JSON.stringify(projectIds));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error updating comparison:', error);
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={handleCompare}
      className={`${sizeClasses[size]} rounded-lg font-medium transition-all flex items-center gap-2 ${
        isComparing
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
      }`}
    >
      <span className="text-lg">⚖️</span>
      {showLabel && <span>{isComparing ? 'Comparing' : 'Compare'}</span>}
    </button>
  );
}
