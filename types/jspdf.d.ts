declare module 'jspdf' {
  // Minimal type to satisfy TS when types aren’t installed
  export class jsPDF {
    constructor(options?: any);
    setFontSize(size: number): this;
    setFont(family: string, style?: string): this;
    splitTextToSize(text: string, maxSize: number): string[];
    text(text: string | string[], x: number, y: number): this;
  addPage(...args: any[]): this; // Added for pagination support
    save(filename: string): void;
  }
}
