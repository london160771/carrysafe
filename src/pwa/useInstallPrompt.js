import { useEffect, useState } from 'react';

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const keep = (event) => {
      event.preventDefault();
      setPrompt(event);
    };
    const clear = () => setPrompt(null);
    window.addEventListener('beforeinstallprompt', keep);
    window.addEventListener('appinstalled', clear);
    return () => {
      window.removeEventListener('beforeinstallprompt', keep);
      window.removeEventListener('appinstalled', clear);
    };
  }, []);

  async function install() {
    await prompt.prompt();
    setPrompt(null);
  }

  return { canInstall: prompt !== null, install };
}
