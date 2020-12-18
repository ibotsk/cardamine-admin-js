import download from 'downloadjs';

import docxcreator from './templates/docx';

async function createAndDownload(data, chosenColumns) {
  const documentBlob = await docxcreator.createDocumentAsBlob(
    data, chosenColumns,
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
