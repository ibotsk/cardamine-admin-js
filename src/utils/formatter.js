import React from 'react';

const italic = (subject) => {
  return <i>{subject}</i>;
};

const format = (subject, format) => {
  switch (format) {
    case 'italic':
      return italic(subject);
    default:
      return subject;
  }
};

// erroneous, doubtful, ambiguous
const eda = ({ ambiguous = false, doubtful = false, erroneous = false }) => {
  const result = [];
  if (ambiguous) {
    result.push('A');
  }
  if (doubtful) {
    result.push('D');
  }
  if (erroneous) {
    result.push('E');
  }
  return result.join('/');
};

export default { format, eda };
