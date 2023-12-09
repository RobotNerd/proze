export interface Formatter {
  getContent(): string;
  writeToFile(path: string): void;
}
