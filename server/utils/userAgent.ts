class UserAgent {
  private _versions = {
    Edge: /(?:edge|edga|edgios|edg)\/([\d\w\.\-]+)/i,
    Firefox: /(?:firefox|fxios)\/([\d\w\.\-]+)/i,
    IE: /msie\s([\d\.]+[\d])|trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i,
    Chrome: /(?:chrome|crios)\/([\d\w\.\-]+)/i,
    Chromium: /chromium\/([\d\w\.\-]+)/i,
    Safari: /(version|safari)\/([\d\w\.\-]+)/i,
    Opera: /version\/([\d\w\.\-]+)|OPR\/([\d\w\.\-]+)/i,
    Ps3: /([\d\w\.\-]+)\)\s*$/i,
    Psp: /([\d\w\.\-]+)\)?\s*$/i,
    Amaya: /amaya\/([\d\w\.\-]+)/i,
    SeaMonkey: /seamonkey\/([\d\w\.\-]+)/i,
    OmniWeb: /omniweb\/v([\d\w\.\-]+)/i,
    Flock: /flock\/([\d\w\.\-]+)/i,
    Epiphany: /epiphany\/([\d\w\.\-]+)/i,
    WinJs: /msapphost\/([\d\w\.\-]+)/i,
    PhantomJS: /phantomjs\/([\d\w\.\-]+)/i,
    AlamoFire: /alamofire\/([\d\w\.\-]+)/i,
    UC: /ucbrowser\/([\d\w\.]+)/i,
    Facebook: /FBAV\/([\d\w\.]+)/i,
    WebKit: /applewebkit\/([\d\w\.]+)/i,
    Wechat: /micromessenger\/([\d\w\.]+)/i,
    Electron: /Electron\/([\d\w\.]+)/i,
  }
  private _browsers = {
    YaBrowser: /yabrowser/i,
    Edge: /edge|edga|edgios|edg/i,
    Amaya: /amaya/i,
    Konqueror: /konqueror/i,
    Epiphany: /epiphany/i,
    SeaMonkey: /seamonkey/i,
    Flock: /flock/i,
    OmniWeb: /omniweb/i,
    Chromium: /chromium/i,
    Chrome: /chrome|crios/i,
    Safari: /safari/i,
    IE: /msie|trident/i,
    Opera: /opera|OPR\//i,
    PS3: /playstation 3/i,
    PSP: /playstation portable/i,
    Firefox: /firefox|fxios/i,
    WinJs: /msapphost/i,
    PhantomJS: /phantomjs/i,
    AlamoFire: /alamofire/i,
    UC: /UCBrowser/i,
    Facebook: /FBA[NV]/,
  }
  private _os = {
    Windows10: /windows nt 10\.0/i,
    Windows81: /windows nt 6\.3/i,
    Windows8: /windows nt 6\.2/i,
    Windows7: /windows nt 6\.1/i,
    UnknownWindows: /windows nt 6\.\d+/i,
    WindowsVista: /windows nt 6\.0/i,
    Windows2003: /windows nt 5\.2/i,
    WindowsXP: /windows nt 5\.1/i,
    Windows2000: /windows nt 5\.0/i,
    WindowsPhone81: /windows phone 8\.1/i,
    WindowsPhone80: /windows phone 8\.0/i,
    OSXCheetah: /os x 10[._]0/i,
    OSXPuma: /os x 10[._]1(\D|$)/i,
    OSXJaguar: /os x 10[._]2/i,
    OSXPanther: /os x 10[._]3/i,
    OSXTiger: /os x 10[._]4/i,
    OSXLeopard: /os x 10[._]5/i,
    OSXSnowLeopard: /os x 10[._]6/i,
    OSXLion: /os x 10[._]7/i,
    OSXMountainLion: /os x 10[._]8/i,
    OSXMavericks: /os x 10[._]9/i,
    OSXYosemite: /os x 10[._]10/i,
    OSXElCapitan: /os x 10[._]11/i,
    MacOSSierra: /os x 10[._]12/i,
    MacOSHighSierra: /os x 10[._]13/i,
    MacOSMojave: /os x 10[._]14/i,
    Mac: /os x/i,
    Linux: /linux/i,
    Linux64: /linux x86\_64/i,
    ChromeOS: /cros/i,
    Wii: /wii/i,
    PS3: /playstation 3/i,
    PSP: /playstation portable/i,
    iPad: /\(iPad.*os (\d+)[._](\d+)/i,
    iPhone: /\(iPhone.*os (\d+)[._](\d+)/i,
    iOS: /ios/i,
    Bada: /Bada\/(\d+)\.(\d+)/i,
    Curl: /curl\/(\d+)\.(\d+)\.(\d+)/i,
    Electron: /Electron\/(\d+)\.(\d+)\.(\d+)/i,
  }
  private _platform = {
    Windows: /windows nt/i,
    WindowsPhone: /windows phone/i,
    Mac: /macintosh/i,
    Linux: /linux/i,
    Wii: /wii/i,
    Playstation: /playstation/i,
    iPad: /ipad/i,
    iPod: /ipod/i,
    iPhone: /iphone/i,
    Android: /android/i,
    Blackberry: /blackberry/i,
    Samsung: /samsung/i,
    Curl: /curl/i,
    Electron: /Electron/i,
    iOS: /^ios\-/i,
  }
  private _defaultAgent = {
    source: '',
    browser: 'unknown',
    version: 'unknown',
    os: 'unknown',
    platform: 'unknown',
    isYaBrowser: false,
    isAuthoritative: true,
    isMobile: false,
    isMobileNative: false,
    isTablet: false,
    isiPad: false,
    isiPod: false,
    isiPhone: false,
    isiPhoneNative: false,
    isAndroid: false,
    isAndroidNative: false,
    isBlackberry: false,
    isOpera: false,
    isIE: false,
    isEdge: false,
    isSafari: false,
    isFirefox: false,
    isWebkit: false,
    isChrome: false,
    isKonqueror: false,
    isOmniWeb: false,
    isSeaMonkey: false,
    isFlock: false,
    isAmaya: false,
    isPhantomJS: false,
    isEpiphany: false,
    isDesktop: false,
    isWindows: false,
    isWindowsPhone: false,
    isLinux: false,
    isLinux64: false,
    isMac: false,
    isChromeOS: false,
    isBada: false,
    isSamsung: false,
    isCurl: false,
    isAndroidTablet: false,
    isWinJs: false,
    isKindleFire: false,
    isCaptive: false,
    isSmartTV: false,
    isUC: false,
    isFacebook: false,
    isAlamoFire: false,
    isElectron: false,
    isWechat: false,
  }
  public agent: typeof this._defaultAgent

  constructor() {
    this.agent = { ...this._defaultAgent }
  }

  private getBrowser = (s: string) => {
    switch (true) {
      case this._browsers.YaBrowser.test(s):
        this.agent.isYaBrowser = true
        return 'YaBrowser'
      case this._browsers.AlamoFire.test(s):
        this.agent.isAlamoFire = true
        return 'AlamoFire'
      case this._browsers.Edge.test(s):
        this.agent.isEdge = true
        return 'Edge'
      case this._browsers.PhantomJS.test(s):
        this.agent.isPhantomJS = true
        return 'PhantomJS'
      case this._browsers.Konqueror.test(s):
        this.agent.isKonqueror = true
        return 'Konqueror'
      case this._browsers.Amaya.test(s):
        this.agent.isAmaya = true
        return 'Amaya'
      case this._browsers.Epiphany.test(s):
        this.agent.isEpiphany = true
        return 'Epiphany'
      case this._browsers.SeaMonkey.test(s):
        this.agent.isSeaMonkey = true
        return 'SeaMonkey'
      case this._browsers.Flock.test(s):
        this.agent.isFlock = true
        return 'Flock'
      case this._browsers.OmniWeb.test(s):
        this.agent.isOmniWeb = true
        return 'OmniWeb'
      case this._browsers.Opera.test(s):
        this.agent.isOpera = true
        return 'Opera'
      case this._browsers.Chromium.test(s):
        this.agent.isChrome = true
        return 'Chromium'
      case this._browsers.Facebook.test(s):
        this.agent.isFacebook = true
        return 'Facebook'
      case this._browsers.Chrome.test(s):
        this.agent.isChrome = true
        return 'Chrome'
      case this._browsers.WinJs.test(s):
        this.agent.isWinJs = true
        return 'WinJs'
      case this._browsers.IE.test(s):
        this.agent.isIE = true
        return 'IE'
      case this._browsers.Firefox.test(s):
        this.agent.isFirefox = true
        return 'Firefox'
      case this._browsers.Safari.test(s):
        this.agent.isSafari = true
        return 'Safari'
      case this._browsers.PS3.test(s):
        return 'ps3'
      case this._browsers.PSP.test(s):
        return 'psp'
      case this._browsers.UC.test(s):
        this.agent.isUC = true
        return 'UCBrowser'
      default:
        if (s.indexOf('Dalvik') !== -1) {
          return 'unknown'
        }

        // If the UA does not start with Mozilla guess the user agent.
        if (s.indexOf('Mozilla') !== 0 && /^([\d\w\-\.]+)\/[\d\w\.\-]+/i.test(s)) {
          this.agent.isAuthoritative = false
          return RegExp.$1
        }
        return 'unknown'
    }
  }

  private getBrowserVersion = (s: string) => {
    switch (this.agent.browser) {
      case 'Edge':
        if (this._versions.Edge.test(s)) {
          return RegExp.$1
        }
        break
      case 'PhantomJS':
        if (this._versions.PhantomJS.test(s)) {
          return RegExp.$1
        }
        break
      case 'Chrome':
        if (this._versions.Chrome.test(s)) {
          return RegExp.$1
        }
        break
      case 'Chromium':
        if (this._versions.Chromium.test(s)) {
          return RegExp.$1
        }
        break
      case 'Safari':
        if (this._versions.Safari.test(s)) {
          return RegExp.$2
        }
        break
      case 'Opera':
        if (this._versions.Opera.test(s)) {
          return RegExp.$1 ? RegExp.$1 : RegExp.$2
        }
        break
      case 'Firefox':
        if (this._versions.Firefox.test(s)) {
          return RegExp.$1
        }
        break
      case 'WinJs':
        if (this._versions.WinJs.test(s)) {
          return RegExp.$1
        }
        break
      case 'IE':
        if (this._versions.IE.test(s)) {
          return RegExp.$2 ? RegExp.$2 : RegExp.$1
        }
        break
      case 'ps3':
        if (this._versions.Ps3.test(s)) {
          return RegExp.$1
        }
        break
      case 'psp':
        if (this._versions.Psp.test(s)) {
          return RegExp.$1
        }
        break
      case 'Amaya':
        if (this._versions.Amaya.test(s)) {
          return RegExp.$1
        }
        break
      case 'Epiphany':
        if (this._versions.Epiphany.test(s)) {
          return RegExp.$1
        }
        break
      case 'SeaMonkey':
        if (this._versions.SeaMonkey.test(s)) {
          return RegExp.$1
        }
        break
      case 'Flock':
        if (this._versions.Flock.test(s)) {
          return RegExp.$1
        }
        break
      case 'OmniWeb':
        if (this._versions.OmniWeb.test(s)) {
          return RegExp.$1
        }
        break
      case 'UCBrowser':
        if (this._versions.UC.test(s)) {
          return RegExp.$1
        }
        break
      case 'Facebook':
        if (this._versions.Facebook.test(s)) {
          return RegExp.$1
        }
        break
      default:
        if (this.agent.browser !== 'unknown') {
          const regex = new RegExp(this.agent.browser + '[\\/ ]([\\d\\w\\.\\-]+)', 'i')
          if (regex.test(s)) {
            return RegExp.$1
          }
        } else {
          this.testWebkit()
          if (this.agent.isWebkit && this._versions.WebKit.test(s)) {
            return RegExp.$1
          }
          return 'unknown'
        }
    }
  }

  private getWechatVersion = (s: string) => {
    if (this._versions.Wechat.test(s)) {
      return RegExp.$1
    }

    return 'unknown'
  }

  private getOS = (s: string) => {
    switch (true) {
      case this._os.WindowsVista.test(s):
        this.agent.isWindows = true
        return 'Windows Vista'
      case this._os.Windows7.test(s):
        this.agent.isWindows = true
        return 'Windows 7'
      case this._os.Windows8.test(s):
        this.agent.isWindows = true
        return 'Windows 8'
      case this._os.Windows81.test(s):
        this.agent.isWindows = true
        return 'Windows 8.1'
      case this._os.Windows10.test(s):
        this.agent.isWindows = true
        return 'Windows 10.0'
      case this._os.Windows2003.test(s):
        this.agent.isWindows = true
        return 'Windows 2003'
      case this._os.WindowsXP.test(s):
        this.agent.isWindows = true
        return 'Windows XP'
      case this._os.Windows2000.test(s):
        this.agent.isWindows = true
        return 'Windows 2000'
      case this._os.WindowsPhone81.test(s):
        this.agent.isWindowsPhone = true
        return 'Windows Phone 8.1'
      case this._os.WindowsPhone80.test(s):
        this.agent.isWindowsPhone = true
        return 'Windows Phone 8.0'
      case this._os.Linux64.test(s):
        this.agent.isLinux = true
        this.agent.isLinux64 = true
        return 'Linux 64'
      case this._os.Linux.test(s):
        this.agent.isLinux = true
        return 'Linux'
      case this._os.ChromeOS.test(s):
        this.agent.isChromeOS = true
        return 'Chrome OS'
      case this._os.Wii.test(s):
        return 'Wii'
      case this._os.PS3.test(s):
        return 'Playstation'
      case this._os.PSP.test(s):
        return 'Playstation'
      case this._os.OSXCheetah.test(s):
        this.agent.isMac = true
        return 'OS X Cheetah'
      case this._os.OSXPuma.test(s):
        this.agent.isMac = true
        return 'OS X Puma'
      case this._os.OSXJaguar.test(s):
        this.agent.isMac = true
        return 'OS X Jaguar'
      case this._os.OSXPanther.test(s):
        this.agent.isMac = true
        return 'OS X Panther'
      case this._os.OSXTiger.test(s):
        this.agent.isMac = true
        return 'OS X Tiger'
      case this._os.OSXLeopard.test(s):
        this.agent.isMac = true
        return 'OS X Leopard'
      case this._os.OSXSnowLeopard.test(s):
        this.agent.isMac = true
        return 'OS X Snow Leopard'
      case this._os.OSXLion.test(s):
        this.agent.isMac = true
        return 'OS X Lion'
      case this._os.OSXMountainLion.test(s):
        this.agent.isMac = true
        return 'OS X Mountain Lion'
      case this._os.OSXMavericks.test(s):
        this.agent.isMac = true
        return 'OS X Mavericks'
      case this._os.OSXYosemite.test(s):
        this.agent.isMac = true
        return 'OS X Yosemite'
      case this._os.OSXElCapitan.test(s):
        this.agent.isMac = true
        return 'OS X El Capitan'
      case this._os.MacOSSierra.test(s):
        this.agent.isMac = true
        return 'macOS Sierra'
      case this._os.MacOSHighSierra.test(s):
        this.agent.isMac = true
        return 'macOS High Sierra'
      case this._os.MacOSMojave.test(s):
        this.agent.isMac = true
        return 'macOS Mojave'
      case this._os.Mac.test(s):
        this.agent.isMac = true
        return 'OS X'
      case this._os.iPad.test(s): {
        this.agent.isiPad = true
        const match = s.match(this._os.iPad)
        return match ? match[0].replace('_', '.') : s
      }
      case this._os.iPhone.test(s): {
        this.agent.isiPhone = true
        const match = s.match(this._os.iPhone)
        return match ? match[0].replace('_', '.') : s
      }
      case this._os.Bada.test(s):
        this.agent.isBada = true
        return 'Bada'
      case this._os.Curl.test(s):
        this.agent.isCurl = true
        return 'Curl'
      case this._os.iOS.test(s):
        this.agent.isiPhone = true
        return 'iOS'
      case this._os.Electron.test(s):
        this.agent.isElectron = true
        return 'Electron'
      default:
        return 'unknown'
    }
  }

  private getPlatform = (s: string) => {
    switch (true) {
      case this._platform.Windows.test(s):
        return 'Microsoft Windows'
      case this._platform.WindowsPhone.test(s):
        this.agent.isWindowsPhone = true
        return 'Microsoft Windows Phone'
      case this._platform.Mac.test(s):
        return 'Apple Mac'
      case this._platform.Curl.test(s):
        return 'Curl'
      case this._platform.Electron.test(s):
        this.agent.isElectron = true
        return 'Electron'
      case this._platform.Android.test(s):
        this.agent.isAndroid = true
        return 'Android'
      case this._platform.Blackberry.test(s):
        this.agent.isBlackberry = true
        return 'Blackberry'
      case this._platform.Linux.test(s):
        return 'Linux'
      case this._platform.Wii.test(s):
        return 'Wii'
      case this._platform.Playstation.test(s):
        return 'Playstation'
      case this._platform.iPad.test(s):
        this.agent.isiPad = true
        return 'iPad'
      case this._platform.iPod.test(s):
        this.agent.isiPod = true
        return 'iPod'
      case this._platform.iPhone.test(s):
        this.agent.isiPhone = true
        return 'iPhone'
      case this._platform.Samsung.test(s):
        this.agent.isSamsung = true
        return 'Samsung'
      case this._platform.iOS.test(s):
        return 'Apple iOS'
      default:
        return 'unknown'
    }
  }

  private testCaptiveNetwork = () => {
    switch (true) {
      case /CaptiveNetwork/gi.test(this.agent.source):
        this.agent.isCaptive = true
        this.agent.isMac = true
        this.agent.platform = 'Apple Mac'
        return 'CaptiveNetwork'
      default:
        return false
    }
  }

  private testMobile = () => {
    switch (true) {
      case this.agent.isWindows:
      case this.agent.isLinux:
      case this.agent.isMac:
      case this.agent.isChromeOS:
        this.agent.isDesktop = true
        break
      case this.agent.isAndroid:
      case this.agent.isSamsung:
        this.agent.isMobile = true
        break
      default:
    }
    switch (true) {
      case this.agent.isiPad:
      case this.agent.isiPod:
      case this.agent.isiPhone:
      case this.agent.isBada:
      case this.agent.isBlackberry:
      case this.agent.isAndroid:
      case this.agent.isWindowsPhone:
        this.agent.isMobile = true
        this.agent.isDesktop = false
        break
      default:
    }
    if (/mobile|^ios\-/i.test(this.agent.source)) {
      this.agent.isMobile = true
      this.agent.isDesktop = false
    }
    if (/dalvik/i.test(this.agent.source)) {
      this.agent.isAndroidNative = true
      this.agent.isMobileNative = true
    }
    if (/scale/i.test(this.agent.source)) {
      this.agent.isiPhoneNative = true
      this.agent.isMobileNative = true
    }
  }

  private testTablet = () => {
    switch (true) {
      case this.agent.isiPad:
      case this.agent.isAndroidTablet:
      case this.agent.isKindleFire:
        this.agent.isTablet = true
        break
    }
    if (/tablet/i.test(this.agent.source)) {
      this.agent.isTablet = true
    }
  }

  private testSmartTV = () => {
    this.agent.isSmartTV = new RegExp('smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv', 'gi').test(
      this.agent.source.toLowerCase(),
    )
  }

  private testAndroidTablet = () => {
    if (this.agent.isAndroid && !/mobile/i.test(this.agent.source)) {
      this.agent.isAndroidTablet = true
    }
  }

  private testWebkit = () => {
    if (this.agent.browser === 'unknown' && /applewebkit/i.test(this.agent.source)) {
      this.agent.browser = 'Apple WebKit'
      this.agent.isWebkit = true
    }
  }

  private testWechat = () => {
    if (/micromessenger/i.test(this.agent.source)) {
      this.agent.isWechat = true
      this.agent.version = this.getWechatVersion(this.agent.source)
    }
  }

  public reset = () => {
    const agent = this.agent
    Object.keys(agent).forEach((key) => {
      ;(agent as Record<string, unknown>)[key] = this._defaultAgent[key as keyof typeof this._defaultAgent]
    })
    return agent
  }

  public parse = (source: string) => {
    this.reset()
    this.agent.source = source.replace(/^\s*/, '').replace(/\s*$/, '')
    this.agent.os = this.getOS(this.agent.source)
    this.agent.platform = this.getPlatform(this.agent.source)
    this.agent.browser = this.getBrowser(this.agent.source)
    this.agent.version = this.getBrowserVersion(this.agent.source) ?? ''
    this.testSmartTV()
    this.testMobile()
    this.testAndroidTablet()
    this.testTablet()
    this.testCaptiveNetwork()
    this.testWebkit()
    this.testWechat()
    return this.agent
  }
}

const getUserAgent = new UserAgent().parse
export default getUserAgent
