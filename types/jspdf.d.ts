declare module 'jspdf' {
  // Minimal type to satisfy TS when types aren’t installed
  export class jsPDF {
    constructor(options?: any);
    setFontSize(size: number): this;
    setFont(family: string, style?: string): this;
    splitTextToSize(text: string, maxSize: number): string[];
    text(text: string | string[], x: number, y: number): this;
  // Added to fix build error in orders page when invoking doc.addPage()
  addPage(options?: any): this;
    save(filename: string): void;
  }
}
