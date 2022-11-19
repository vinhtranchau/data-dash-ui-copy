import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export enum XLSContentDataType {
  Array = 'ARRAY',
  JSON = 'JSON',
}

export interface XLSSheet {
  name: string;
  type: XLSContentDataType;
  content: any;
}

export function downloadXLS(filename: string, sheets: XLSSheet[]): void {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const workBook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    let worksheet;
    switch (sheet.type) {
      case XLSContentDataType.Array:
        worksheet = XLSX.utils.aoa_to_sheet(sheet.content);
        break;
      case XLSContentDataType.JSON:
      default:
        worksheet = XLSX.utils.json_to_sheet(sheet.content);
        break;
    }
    try {
      XLSX.utils.book_append_sheet(workBook, worksheet, sheet.name);
    } catch (e) {
      console.log('Failed to add content to sheet', e);
    }
  });

  const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
  const fileData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(fileData, filename + fileExtension);
}
