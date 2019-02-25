import React, { Component } from 'react';

import {
    Col,
    Button, Glyphicon,
    FormGroup, InputGroup,
    ListGroup, ListGroupItem
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
import SynonymListItem from './SynonymListItem';

class AddableList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: undefined
        }
    }

    onChange = (selected) => {
        this.setState({
            selected
        });
    }

    onAddItem = () => {
        if (this.state.selected) {
            this.props.onAddItemToList(this.state.selected[0])

            this.typeahead.getInstance().clear();
            this.setState({
                selected: undefined
            });
        }
    }

    render() {
        const data = this.props.data || [];
        return (
            <div className="concise-list">
                <ListGroup>
                    {
                        // row must contain id, props is the rest
                        data.map(({ id, ...props }, index) =>
                            <SynonymListItem
                                key={index}
                                data={props}
                                onRowDelete={() => this.props.onRowDelete(id)}
                                onRowChangeType={() => this.props.onChangeType(id)}
                                changeTypeVal={this.props.changeToTypeSymbol}
                            />
                        )
                    }
                    <ListGroupItem>
                        <FormGroup>
                            <Col sm={12}>
                                <InputGroup bsSize='sm'>
                                    <Typeahead
                                        bsSize='sm'
                                        ref={(typeahead) => this.typeahead = typeahead}
                                        options={this.props.options}
                                        onChange={this.onChange}
                                        selected={this.state.selected}
                                        placeholder="Start by typing"
                                    />
                                    <InputGroup.Button>
                                        <Button
                                            bsStyle='success'
                                            onClick={this.onAddItem}
                                            disabled={!(!!this.state.selected && this.state.selected.length > 0)}> {/* disabled when selected is undefined or empty array */}
                                            <Glyphicon glyph='plus' />
                                        </Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}

export default AddableList;