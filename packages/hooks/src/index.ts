import { useState, useEffect } from 'react';

// Mock hook for User Session
export const useUser = () => {
  const [user, setUser] = useState<{ id: string; name: string; tier: string } | null>(null);
  
  useEffect(() => {
    // In a real app, this would call apiClient.getUserProfile()
    setUser({ id: 'u_123', name: 'Demo User', tier: 'Pro' });
  }, []);

  return { user, isLoading: !user };
};

// Mock hook for Workspace
export const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setWorkspace({ id: 'ws_123', name: 'My Workspace' });
  }, []);

  return { workspace, isLoading: !workspace };
};

// Mock hook for Render Progress
export const useRenderProgress = (jobId: string) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 1000);
    return () => clearInterval(interval);
  }, [jobId]);

  return { progress, isComplete: progress >= 100 };
};

