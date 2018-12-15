import React from 'react';
import { Table } from 'react-bootstrap';

const TR = (props) => {
    return (
        <tr>
            {Object.keys(props.value).map((k, i) => <td key={i}>{props.value[k]}</td>)}
        </tr>
    );
}

const CTable = (props) => {
    const head = props.head || [];
    return (
        <Table striped bordered condensed>
            <thead>
                <tr>
                    {head.map(title => <th key={title}>{title}</th>)}
                </tr>
            </thead>
            <tbody>
                {props.rows.map(r => <TR key={r.id} value={r} />)}
            </tbody>
        </Table>
    );
}

export default CTable;