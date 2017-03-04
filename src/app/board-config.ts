import { Colours } from './lib/colours';

export interface IBoardConfig {
  id: number;
  mac: string;
  maintype: string;
  subtype: string;
  name: string;
  status: string;
  last_activity: string;
  colour: string;
  accepted_links: string[];
}

export class BoardConfig {
  private id: number;
  private mac: string;
  private maintype: string;
  private name: string;
  private subtype: string;
  private status: string;
  public last_activity: string;
  private colour: string;
  private accepted_links: string[];

  constructor(obj?: IBoardConfig) {
    this.id = obj && obj.id;
    this.mac = obj && obj.mac || '';
    this.maintype = obj && obj.maintype || 'input';
    this.subtype = obj && obj.subtype || 'button';
    this.name = obj && obj.name || `${this.maintype} Component`;
    this.status = obj && obj.status || 'offline';
    this.last_activity = obj && obj.last_activity;
    this.colour = Colours.getColour(this.id);
    this.accepted_links = obj && obj.accepted_links || [];
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

  getName(): string {
    return this.name;
  }

  getAcceptedLinks(): string[] {
    return this.accepted_links;
  }
}
