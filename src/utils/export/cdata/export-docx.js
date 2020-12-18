import download from 'downloadjs';

import docxcreator from './templates/docx';

async function createAndDownload(data, chosenColumns, options) {
  const documentBlob = await docxcreator.createDocumentAsBlob(
    data, chosenColumns, options,
  );
  return download(
    documentBlob,
    'chromosomes.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  );
}

export default {
  createAndDownload,
};
