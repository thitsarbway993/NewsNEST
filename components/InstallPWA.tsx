'use client';

import { useEffect, useState } from 'react';
import { Button, Alert } from '@mui/material';
import { BeforeInstallPromptEvent } from '@/types/pwa';

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  if (!installPrompt) return null;

  return (
    <Alert 
      severity="info" 
      action={
        <Button color="inherit" size="small" onClick={handleInstall}>
          Install
        </Button>
      }
      sx={{ mb: 2 }}
    >
      Install this app for better experience
    </Alert>
  );
}