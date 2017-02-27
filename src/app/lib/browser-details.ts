export class BrowserDetails {

  static os(userAgent): string {
    let os: string = "";
    userAgent = userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) {
      os = 'Windows';
    } else if (userAgent.indexOf('mac') !== -1) {
      os = 'MacOS';
    } else if (userAgent.indexOf('x11') !== -1) {
      os = 'UNIX';
    } else if (userAgent.indexOf('linux') !== -1) {
      os = 'Linux';
    }
    return os;
  }

  static browser(userAgent): any {
    let version, name;
    let majorVersion = parseInt(navigator.appVersion,10);
    let verOffset, ix;

    if ((verOffset = userAgent.indexOf("Chrome")) != -1) {
     name = "Chrome";
     version = userAgent.substring(verOffset + 7);
    }
    else if ((verOffset = userAgent.indexOf("Firefox")) != -1) {
     name = "Firefox";
     version = userAgent.substring(verOffset + 8);
    }

    if ((ix = version.indexOf(";"))!=-1)
       version = version.substring(0, ix);
    if ((ix = version.indexOf(" "))!=-1)
       version = version.substring(0, ix);

    majorVersion = parseInt(version, 10);
    if (isNaN(majorVersion)) {
       version  = parseFloat(navigator.appVersion);
       majorVersion = parseInt(navigator.appVersion, 10);
    }
    return {
      name,
      version
    };
  }

  static getDetails(): string {
    const userAgent = window.navigator.userAgent;
    const browser = this.browser(userAgent);

    return `${this.os(userAgent)}|${browser.name}|${browser.version.replace(/\./g,':')}`;
  }
}
