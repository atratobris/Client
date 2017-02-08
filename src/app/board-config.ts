interface IBoardConfig {
  mac: string;
  type: string;
  subtype: string;
  name: string;
}

export class BoardConfig {
  private mac: string;
  private type: string;
  private name: string;
  private subtype: string;
  constructor(obj?: IBoardConfig) {
    this.mac = obj && obj.mac || '';
    this.type = obj && obj.type || 'input';
    this.subtype = obj && obj.subtype || 'button';
    this.name = obj && obj.name || `${this.type} Component`;
  }

  setMac(mac: string): void {
    this.mac = mac;
  }
}
