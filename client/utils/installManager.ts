interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
    appinstalled: Event
  }
}

export class InstallManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null
  private isInstalled = false
  private isDismissed = false
  private callbacks: { onReadyToInstall: ((ready: boolean) => void)[] } = { onReadyToInstall: [] }

  constructor() {
    this.setupEventListeners()
    this.isInstalled = this.isStandalone()
  }

  public registerCallbacks = (callbacks: { onReadyToInstall?: (ready: boolean) => void }) => {
    if (callbacks.onReadyToInstall) {
      this.callbacks.onReadyToInstall.push(callbacks.onReadyToInstall)
    }
  }

  private setupEventListeners(): void {
    globalThis.window.addEventListener('beforeinstallprompt', (e) => {
      // e.preventDefault()
      this.deferredPrompt = e as BeforeInstallPromptEvent

      this.callbacks.onReadyToInstall.forEach((callback) => callback(true))
    }, { once: true })

    globalThis.window.addEventListener('appinstalled', () => {
      this.isInstalled = true
      this.deferredPrompt = null
      this.callbacks.onReadyToInstall.forEach((callback) => callback(false))
      console.log('App was installed.')
    })

    globalThis.window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      this.isInstalled = e.matches
    })
  }

  private isStandalone = () => globalThis.window.matchMedia('(display-mode: standalone)').matches

  public installAvailable(): boolean {
    // Show button only if:
    // 1. Prompt was not declined
    // 1. PWA is installable (we have deferred prompt)
    // 2. PWA is not already installed
    // 3. Not in standalone mode
    // 4. Browser support
    return !this.isDismissed &&
      this.deferredPrompt !== null &&
      !this.isInstalled &&
      !this.isStandalone() &&
      this.supportsPWAInstall()
  }

  public async installPWA(): Promise<{ done: boolean; error?: string }> {
    if (this.isDismissed || !this.deferredPrompt) {
      return { done: false, error: 'Installation is unavailable.' }
    }

    try {
      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice

      if (outcome === 'accepted') {
        this.deferredPrompt = null
        return { done: true }
      } else {
        this.isDismissed = true
        return { done: false, error: 'Installation was declined.' }
      }
    } catch (error) {
      return { done: false, error: `Error installing PWA: ${error instanceof Error ? error.message : String(error)}` }
    }
  }

  public getDeviceType(): 'desktop' | 'android' | 'iOS' {
    const userAgent = navigator.userAgent.toLowerCase()

    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    if (isIOS) {
      return 'iOS'
    }

    const isAndroid = /android/.test(userAgent)
    if (isAndroid) {
      return 'android'
    }

    return 'desktop'
  }

  public getPlatformInfo() {
    const userAgent = navigator.userAgent.toLowerCase()
    const device = this.getDeviceType()

    let browser = 'unknown'
    if (userAgent.includes('chrome') && !userAgent.includes('edg/')) {
      browser = 'chrome'
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      browser = 'safari'
    } else if (userAgent.includes('firefox')) {
      browser = 'firefox'
    } else if (userAgent.includes('edg/')) {
      browser = 'edge'
    }

    return {
      device,
      browser,
      isMobile: device === 'android' || device === 'iOS',
      isStandalone: this.isInstalled,
    }
  }

  public supportsPWAInstall(): boolean {
    const platform = this.getPlatformInfo()

    return platform.browser !== 'unknown' && platform.browser !== 'safari'
  }

  public getInstallInstructions(): string {
    const platform = this.getPlatformInfo()

    switch (platform.device) {
      case 'android':
        return 'Tap the menu button (⋮) and select "Install app" or "Add to Home screen"'

      case 'iOS':
        return 'Tap the share button (⎙) and select "Add to Home Screen"'

      case 'desktop':
        if (platform.browser === 'chrome') {
          return 'Click the install icon (⎙) in the address bar'
        } else if (platform.browser === 'edge') {
          return 'Click the install icon (⎙) in the address bar'
        } else if (platform.browser === 'firefox') {
          return 'Click the install icon (⬇) in the address bar'
        } else {
          return 'Look for the install option in your browser menu'
        }

      default:
        return "Use your browser's menu to install this app"
    }
  }
}
