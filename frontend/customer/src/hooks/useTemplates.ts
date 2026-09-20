import { useState, useEffect, useCallback } from 'react';
import { TemplateOption } from '../types';
import { TEMPLATE_OPTIONS } from '../data/seedData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface BackendTemplate {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tier: string;
  thumbnailUrl: string;
  previewUrl: string;
  rating: number;
  isActive: boolean;
  isPopular: boolean;
  isNew: boolean;
  sortOrder: number;
  supportedFeatures: string[];
  defaultConfig?: {
    primaryColor?: string;
    font?: string;
    accentColors?: string[];
    secondaryColor?: string;
  };
}

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateOption[]>(TEMPLATE_OPTIONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveFromDB, setIsLiveFromDB] = useState<boolean>(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/templates`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const mapped: TemplateOption[] = result.data.map((t: BackendTemplate) => ({
          id: t.id,
          slug: t.slug,
          name: t.name,
          tagline: t.tagline,
          description: t.description,
          color: t.defaultConfig?.primaryColor || '#A3158A',
          cover: t.thumbnailUrl,
          font: t.defaultConfig?.font || 'Nunito & Inter',
          category: t.category,
          tier: t.tier,
          rating: t.rating,
          isPopular: t.isPopular,
          isNew: t.isNew,
        }));
        setTemplates(mapped);
        setIsLiveFromDB(true);
      } else {
        throw new Error('Format response API template tidak valid');
      }
    } catch (err: any) {
      console.info(
        '[useTemplates] Backend API offline atau tidak terjangkau, menggunakan fallback katalog lokal:',
        err.message
      );
      setTemplates(TEMPLATE_OPTIONS);
      setIsLiveFromDB(false);
      setError(err.message || 'Gagal terhubung ke API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    isLiveFromDB,
    refetch: fetchTemplates,
  };
}
