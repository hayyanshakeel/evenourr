import { useState, useCallback } from 'react';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';
import { CmsLayoutData, CmsBlock } from '@/lib/cms/schema';

export function useCms(initialLayout: CmsLayoutData) {
  const [layout, setLayout] = useState<CmsLayoutData>(initialLayout);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { authenticatedFetch } = useAuthenticatedFetch();

  const updateLayout = useCallback((newLayout: CmsLayoutData) => {
    setLayout(newLayout);
  }, []);

  const addBlock = useCallback((block: CmsBlock, position?: number) => {
    setLayout(prev => {
      const blocks = [...prev.blocks];
      if (position !== undefined) {
        blocks.splice(position, 0, block);
      } else {
        blocks.push(block);
      }
      return { ...prev, blocks };
    });
  }, []);

  const updateBlock = useCallback((blockId: string, props: any) => {
    setLayout(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, props: { ...block.props, ...props } } : block
      )
    }));
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setLayout(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  }, []);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setLayout(prev => {
      const blocks = [...prev.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      if (moved) {
        blocks.splice(toIndex, 0, moved);
      }
      return { ...prev, blocks };
    });
  }, []);

  const saveLayout = useCallback(async (slug: string, name: string, device: string = 'responsive') => {
    setSaving(true);
    try {
      const response = await authenticatedFetch('/api/admin/cms/layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          device,
          data: layout,
          published: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save layout');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving layout:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [layout, authenticatedFetch]);

  const publishLayout = useCallback(async (slug: string, name: string, device: string = 'responsive') => {
    setPublishing(true);
    try {
      const response = await authenticatedFetch('/api/admin/cms/layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          device,
          data: layout,
          published: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to publish layout');
      }

      return await response.json();
    } catch (error) {
      console.error('Error publishing layout:', error);
      throw error;
    } finally {
      setPublishing(false);
    }
  }, [layout, authenticatedFetch]);

  const loadLayout = useCallback(async (slug: string) => {
    try {
      const response = await authenticatedFetch(`/api/admin/cms/layouts?slug=${slug}`);
      if (!response.ok) {
        throw new Error('Failed to load layout');
      }
      const data = await response.json();
      if (data.item?.data) {
        setLayout(data.item.data);
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      throw error;
    }
  }, [authenticatedFetch]);

  return {
    layout,
    saving,
    publishing,
    updateLayout,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    saveLayout,
    publishLayout,
    loadLayout
  };
}
