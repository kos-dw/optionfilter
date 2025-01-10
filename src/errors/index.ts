export class OptionFilterError extends Error {
  static {
    this.prototype.name = "OptionFilterError";
  }

  constructor(message: string) {
    const stackLine = (new Error().stack?.split("\n")[2] || "").trim();
    super(`OptionFilterError:\n${message}\n\n${stackLine}`);
  }
}
