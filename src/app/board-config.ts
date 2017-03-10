import { Colours } from './lib/colours';
import { LinkOption } from './link/link';

export interface IBoardConfig {
  id: number;
  mac: string;
  type: string;
  name: string;
  status: string;
  last_activity: string;
  colour: string;
  accepted_links: LinkOption[];
}

export class BoardConfig {
  private id: number;
  public mac: string;
  private name: string;
  public type: string;
  private status: string;
  public last_activity: string;
  private colour: string;
  private accepted_links: LinkOption[];

  constructor(obj?: IBoardConfig) {
    this.id = obj && obj.id;
    this.mac = obj && obj.mac || '';
    this.type = obj && obj.type || 'Input';
    this.name = obj && obj.name || `${this.type} Component`;
    this.status = obj && obj.status || 'offline';
    this.last_activity = obj && obj.last_activity;
    this.colour = Colours.getColour(this.id);
    this.accepted_links = [];
    if (obj) {
      // for (let key = 0; key < obj.accepted_links.length; key++) {
      console.log(obj.accepted_links);
      if (0 in obj.accepted_links){
        for (let i=0; i<obj.accepted_links.length; i++) {
          this.accepted_links.push(obj.accepted_links[i]);
        }
      } else {
        for ( const key in obj.accepted_links ) {
          if (obj.accepted_links.hasOwnProperty(key)) {
            this.accepted_links.push(new LinkOption({ 'name': key, 'description': obj.accepted_links[key] }));
          }
        }
      }
    }
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

  setName(name: string): void {
    this.name = name;
  }

  getAcceptedLinks(): LinkOption[] {
    return this.accepted_links;
  }

  getType(): string {
    return this.type;
  }
}
