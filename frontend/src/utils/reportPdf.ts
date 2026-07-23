export const saveReportAsPdf = (title: string, body: string): void => {
  const popup = window.open('', '_blank');
  if (!popup) return;
  popup.document.write(`<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#172019}h1{font-size:24px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #d9e0d4}th{background:#f1f7ed;color:#3f6f43}</style></head><body><h1>${title}</h1><p>Generated ${new Date().toLocaleString()}</p>${body}</body></html>`);
  popup.document.close();
  popup.focus();
  window.setTimeout(() => {
    popup.print();
  }, 500);
};
