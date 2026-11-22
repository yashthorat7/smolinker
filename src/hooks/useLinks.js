import { useState, useEffect, useCallback } from 'react';
import { getUserUrls, deleteUrl, deleteMultipleUrls, updateOriginalUrl } from '@/services/linkService';

export default function useLinks(user) {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeLinkModal, setActiveLinkModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLinks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getUserUrls(user.id);
      setUrls(data || []);
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLinks();
  }, [user, fetchLinks]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => 
      prev.length === urls.length ? [] : urls.map((u) => u.id)
    );
  }, [urls]);

  const handleBulkDelete = useCallback(async () => {
    if (!selectedIds.length) return;
    setIsDeleting(true);
    try {
      await deleteMultipleUrls(selectedIds);
      setUrls((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error('Bulk delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedIds]);

  const handleDeleteSingle = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      await deleteUrl(id);
      setUrls((prev) => prev.filter((u) => u.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      if (activeLinkModal?.id === id) {
        setActiveLinkModal(null);
      }
    } catch (err) {
      console.error('Single delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [activeLinkModal]);

  const handleUpdateUrl = useCallback(async (id, newUrl) => {
    try {
      const updated = await updateOriginalUrl(id, newUrl);
      setUrls((prev) => 
        prev.map((u) => (u.id === id ? { ...u, original_url: updated.original_url } : u))
      );
      if (activeLinkModal?.id === id) {
        setActiveLinkModal((prev) => prev ? { ...prev, original_url: updated.original_url } : null);
      }
      return true;
    } catch (err) {
      console.error('Update URL failed:', err);
      return false;
    }
  }, [activeLinkModal]);

  const openModal = useCallback((link) => {
    setActiveLinkModal(link);
  }, []);

  const closeModal = useCallback(() => {
    setActiveLinkModal(null);
  }, []);

  return {
    urls,
    isLoading,
    isDeleting,
    selectedIds,
    activeLinkModal,
    fetchLinks,
    toggleSelect,
    toggleSelectAll,
    handleBulkDelete,
    handleDeleteSingle,
    handleUpdateUrl,
    openModal,
    closeModal,
  };
}
