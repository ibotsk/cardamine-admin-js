import React, { Component } from 'react';

import {
    Col,
    Button, Glyphicon,
    FormGroup, InputGroup,
    ListGroup, ListGroupItem
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
// import SynonymListItem from './SynonymListItem';

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
        const { itemComponent: ListRow } = this.props;
        return (
            <div className="addable-list compact-list">
                <ListGroup>
                    {
                        // row must contain id, props is the rest
                        // ListRow is an injected component that will be rendered as item
                        data.map(({ id, ...props }, index) =>
                            <ListRow
                                rowId={id}
                                key={index}
                                data={props}
                                onRowDelete={() => this.props.onRowDelete(id)} />
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
                                            disabled={!(!!this.state.selected && this.state.selected.length > 0) /* disabled when selected is undefined or empty array */}
                                            title="Add to this list" >
                                            <Glyphicon glyph='plus' /> Add
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