export class Log {
  public id: number;
  public log_type: string;
  public message: string;
  public created_at: string;

  constructor(log: any) {
    this.id = log.id;
    this.log_type = log.log_type;
    this.message = log.message;
    this.created_at = log.created_at;
  }
}
