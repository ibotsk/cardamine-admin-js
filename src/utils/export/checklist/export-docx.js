import download from 'downloadjs';

import docxcreator from './templates/docx';

async function createAndDownload(speciesList) {
  const documentBlob = await docxcreator.createDocumentAsBlob(speciesList);
  return download(
    documentBlob,
    'checklist.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  );
}

export default {
  createAndDownload,
};
