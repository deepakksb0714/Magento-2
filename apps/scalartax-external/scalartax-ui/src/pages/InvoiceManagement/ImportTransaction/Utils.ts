import Papa from 'papaparse';
import { read, utils } from 'xlsx';

export function handleAcceptedFiles(files: any, cb: any) {
  files.map((file: any) =>
    Object.assign(file, {
      preview: URL.createObjectURL(file),
      formattedSize: formatBytes(file.size),
    })
  );
  cb(files);
}
export function formatBytes(bytes: any, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export const handleDownload = (fileName: string) => {
  const link = document.createElement('a');
  link.href = `${process.env.PUBLIC_URL}/downloadResource/${fileName}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function ReadTransactionFile(file: any, cb: any) {
  if (file.type === 'text/csv') {
    process_csv(file, cb);
  } else if (
    file.type === 'application/vnd.ms-excel' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    process_xls(file, cb);
  } else {
    cb({
      error: true,
      message: 'Unknown file type! Please upload a valid file type.',
      data: [],
    });
  }
}
function process_csv(file: any, cb: any) {
  Papa.parse(file, {
    delimiter: '',
    newline: '\r\n',
    quoteChar: '"',
    escapeChar: '"',
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      cb({
        error: false,
        message: 'File Got Successfully uploaded.',
        data: results,
      });
    },
    error: function (error) {},
  });
}
function process_xls(file: any, cb: any) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = read(data, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const dataParse = utils.sheet_to_json(worksheet, { header: 1 });
    cb({
      error: false,
      message: 'File Got Successfully uploaded.',
      data: dataParse,
    });
  };
  const res = reader.readAsArrayBuffer(file);
}
