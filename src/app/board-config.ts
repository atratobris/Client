export interface IBoardConfig {
  mac: string;
  type: string;
  subtype: string;
  name: string;
  button: boolean;
}

export class BoardConfig {
  private mac: string;
  private type: string;
  private name: string;
  private subtype: string;

  public button: boolean;

  constructor(obj?: IBoardConfig) {
    this.mac = obj && obj.mac || '';
    this.type = obj && obj.type || 'input';
    this.subtype = obj && obj.subtype || 'button';
    this.name = obj && obj.name || `${this.type} Component`;
    this.button = obj && obj.button || false;
  }

  setMac(mac: string): void {
    this.mac = mac;
  }

  getMac(): string {
    return this.mac;
  }
}
