export interface IBoardConfig {
  mac: string;
  maintype: string;
  subtype: string;
  name: string;
  button: boolean;
  status: string;
}

export class BoardConfig {
  private mac: string;
  private maintype: string;
  private name: string;
  private subtype: string;
  private status: string;
  public button: boolean;

  constructor(obj?: IBoardConfig) {
    this.mac = obj && obj.mac || '';
    this.maintype = obj && obj.maintype || 'input';
    this.subtype = obj && obj.subtype || 'button';
    this.name = obj && obj.name || `${this.maintype} Component`;
    this.button = obj && obj.button || false;
    this.status = obj && obj.status || "offline";
  }
  setMac(mac: string): void {
    this.mac = mac;
  }

  getMac(): string {
    return this.mac;
  }
}
