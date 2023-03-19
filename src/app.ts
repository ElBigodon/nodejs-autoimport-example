export class Application {
  private constructor() {}

  public static readonly applicationUptime = Date.now()

  public static uptime() {
    return Date.now() - applicationUptime;
  }
}
