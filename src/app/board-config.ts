import { Colours } from './lib/colours';
import { Board } from './board/board';
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
  metadata: any;
  subtype: string;
  image_url: string;
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
  private animated = false;
  private is_used = false;
  private metadata: any;
  private used_count = 0;
  private subtype: string;
  private image_url: string;

  constructor(obj?: IBoardConfig) {
    this.id = obj && obj.id;
    this.mac = obj && obj.mac || '';
    this.type = obj && obj.type || 'Input';
    this.subtype = obj && obj.subtype || 'RealBoard';
    this.name = obj && obj.name || `${this.type}`;
    this.status = obj && obj.status || 'offline';
    this.last_activity = obj && obj.last_activity;
    this.colour = Colours.getColour(this.id);
    this.accepted_links = [];
    this.metadata = obj && obj.metadata || {};
    this.image_url = obj && obj.image_url || '';
    if (obj) {
      if (obj.accepted_links && 0 in obj.accepted_links) {
        for (let i = 0; i < obj.accepted_links.length; i++) {
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

  newBoard(configs: BoardConfig[]): BoardConfig {
    if (this.subtype === 'RealBoard') { return this; }
    if (this.subtype === 'VirtualBoard') {
      const boards = configs.filter( config => config.getType() === this.type );
      let index = 0;
      while ( index < boards.length ) {
        const mac = `${this.type}${index}`;
        if ( boards.map(b => b.getMac()).indexOf(mac) === -1 ) { break; }
        index++;
      }
      return this.nextBoard(index);
    }
  }

  getSubType(): string {
    return this.subtype;
  }

  setStatus(status: string): void {
    this.status = status;
  }

  nextBoard(index: number): BoardConfig {
    this.mac = `${this.type}${index}`;
    this.name = `${this.type}`;
    return this.copy();
  }

  setMac(mac: string): void {
    this.mac = mac;
  }

  getMac(): string {
    return this.mac;
  }

  getMetadata(): any {
    return  this.metadata;
  }

  setMetadata(metadata: any): any {
    this.metadata = metadata;
  }

  in_use(): boolean {
    return this.is_used;
  }

  used( is_used: boolean ): void {
    this.is_used = is_used;
  }

  inBoards(boards: Board[]): boolean {
    const b = boards.find((board) => board.getMac() === this.mac );
    return !!b;
  }

  setCount( count: number): void {
    this.used_count = count;
  }

  getCount(): number {
    return this.used_count;
  }

  animate(): void {
    this.animated = true;
    setTimeout(() => this.animated = false, 1000);
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

  copy(): BoardConfig {
    return new BoardConfig(this.prepare());
  }

  prepare(): IBoardConfig {
    return {
      id: null,
      mac: this.mac,
      type: this.type,
      name: this.name,
      status: this.status,
      subtype: this.subtype,
      last_activity: this.last_activity,
      colour: this.colour,
      accepted_links: this.accepted_links,
      image_url: this.image_url,
      metadata: this.metadata
    } as IBoardConfig;
  }

  getType(): string {
    return this.type;
  }

  getImageUrl(): string {
    return this.image_url;
  }

  setImageUrl(new_url: string): void {
    this.image_url = new_url;
  }

  isReal(): boolean {
    return this.subtype === 'RealBoard';
  }
}
