'use client';

import { useState, useEffect } from 'react';

interface SaveButtonProps {
  projectSlug: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function SaveButton({ projectSlug, size = 'md', showLabel = true }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkIfSaved();
  }, [projectSlug]);

  function checkIfSaved() {
    try {
      const saved = localStorage.getItem('saved_projects');
      const projectIds = saved ? JSON.parse(saved) : [];
      setIsSaved(projectIds.includes(projectSlug));
    } catch (error) {
      console.error('Error checking saved projects:', error);
    }
  }

  function toggleSave() {
    try {
      const saved = localStorage.getItem('saved_projects');
      let projectIds = saved ? JSON.parse(saved) : [];

      if (isSaved) {
        projectIds = projectIds.filter((id: string) => id !== projectSlug);
      } else {
        projectIds.push(projectSlug);
      }

      localStorage.setItem('saved_projects', JSON.stringify(projectIds));
      setIsSaved(!isSaved);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving project:', error);
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
      onClick={toggleSave}
      className={`${sizeClasses[size]} rounded-lg font-medium transition-all flex items-center gap-2 ${
        isSaved
          ? 'bg-accent text-white hover:bg-opacity-90'
          : 'bg-white border-2 border-accent text-accent hover:bg-accent hover:text-white'
      }`}
    >
      <span className="text-lg">{isSaved ? '★' : '☆'}</span>
      {showLabel && <span>{isSaved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
