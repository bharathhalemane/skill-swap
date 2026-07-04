import { useEffect, useState, useCallback } from 'react';

const isRunningStandalone = () => {
    window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone == true

}
export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(isRunningStandalone())

    useEffect(() => {
        const onBeforeInstallPrompt = (e) => {
            e.preventDefault() 
            setDeferredPrompt(e)
        }

        const onAppInstalled = () => {
            setIsInstalled(true)
            setDeferredPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
        window.addEventListener('appinstalled', onAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
            window.removeEventListener('appinstalled', onAppInstalled)
        }
    },[])

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) return { outcome: 'unavailable' }
        
        deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice

        setDeferredPrompt(null)

        if (choice.outcome === 'accepted') {
            setIsInstalled(true)
        }

        return choice
    }, [deferredPrompt])

    return{
        canInstall: Boolean(deferredPrompt) && !isInstalled,
        isInstalled,
        promptInstall,
    }
}

export default useInstallPrompt