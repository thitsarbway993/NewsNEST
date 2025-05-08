'use client';

import { useEffect, useState } from 'react';
import { Button, Alert } from '@mui/material';

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (installPrompt) {
      (installPrompt as any).prompt();
      (installPrompt as any).userChoice.then(() => {
        setInstallPrompt(null);
      });
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