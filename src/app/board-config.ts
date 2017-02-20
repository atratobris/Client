import { Colours } from './lib/colours';

export interface IBoardConfig {
  id: number;
  mac: string;
  type: string;
  subtype: string;
  name: string;
  button: boolean;
  status: string;
  last_activity: string;
  colour: string;
}

export class BoardConfig {
  private id: number;
  private mac: string;
  private type: string;
  private name: string;
  private subtype: string;
  private status: string;
  public button: boolean;
  public last_activity: string;
  private colour: string;

  constructor(obj?: IBoardConfig) {
    this.id = obj && obj.id;
    this.mac = obj && obj.mac || '';
    this.type = obj && obj.type || 'input';
    this.subtype = obj && obj.subtype || 'button';
    this.name = obj && obj.name || `${this.type} Component`;
    this.button = obj && obj.button || false;
    this.status = obj && obj.status || "offline";
    this.last_activity = obj && obj.last_activity;
    this.colour = obj && obj.colour || Colours.getColour(this.id);
  }

  setMac(mac: string): void {
    this.mac = mac;
  }

  getMac(): string {
    return this.mac;
  }

  setId(id: number): void {
    this.id = id;
  }

  getId(): number {
    return this.id;
  }

  setColour(): void {
    this.colour = this.colour || Colours.getColour(this.id);
  }

  getColour(): string {
    return this.colour;
  }
}
