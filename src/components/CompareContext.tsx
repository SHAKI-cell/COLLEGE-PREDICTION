'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './Toast';

export interface CollegeCompareItem {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  locationCity: string;
  locationState: string;
  rating: number;
  feesMin: number;
  feesMax: number;
  placementAverage: number;
  placementHighest: number;
  type: string;
  facilities: string[];
  _count?: {
    courses: number;
    reviews: number;
  };
}

interface CompareContextType {
  compareList: CollegeCompareItem[];
  addToCompare: (college: CollegeCompareItem) => void;
  removeFromCompare: (id: string) => void;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<CollegeCompareItem[]>([]);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('uni_compare_list');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse compare list', e);
      }
    }
  }, []);

  const saveToStorage = (list: CollegeCompareItem[]) => {
    setCompareList(list);
    localStorage.setItem('uni_compare_list', JSON.stringify(list));
  };

  const addToCompare = (college: CollegeCompareItem) => {
    // Check if already in list
    if (compareList.some(item => item.id === college.id)) {
      toast('College is already in your comparison list', 'info');
      return;
    }

    // Check limit
    if (compareList.length >= 3) {
      toast('You can compare a maximum of 3 colleges side-by-side', 'warning');
      return;
    }

    const newList = [...compareList, college];
    saveToStorage(newList);
    toast(`${college.name} added to comparison`, 'success');
  };

  const removeFromCompare = (id: string) => {
    const college = compareList.find(item => item.id === id);
    const newList = compareList.filter(item => item.id !== id);
    saveToStorage(newList);
    if (college) {
      toast(`${college.name} removed from comparison`, 'info');
    }
  };

  const isCompared = (id: string) => {
    return compareList.some(item => item.id === id);
  };

  const clearCompare = () => {
    saveToStorage([]);
    toast('Comparison list cleared', 'info');
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isCompared,
        clearCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
