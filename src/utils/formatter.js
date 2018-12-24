import React from 'react';

const italic = (subject) => {
    return <i>{subject}</i>;
}

const format = (subject, format) => {
    switch (format) {
        case 'italic': return italic(subject);
        default: return subject;
    }
}

export default format;