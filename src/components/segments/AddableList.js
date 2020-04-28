import React, { Component } from 'react';

import {
  Col,
  Button,
  Glyphicon,
  FormGroup,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';

class AddableList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: undefined,
    };
  }

  onChange = (selected) => {
    this.setState({
      selected,
    });
  };

  onAddItem = () => {
    const { selected } = this.state;
    const { onAddItemToList } = this.props;
    if (selected) {
      onAddItemToList(selected[0]);

      this.typeahead.getInstance().clear();
      this.setState({
        selected: undefined,
      });
    }
  };

  render() {
    // rowId = (data) => return "id"; default is array index
    const {
      id,
      data = [],
      itemComponent: ListRowItem,
      getRowId,
      onRowDelete,
      options,
      ...props
    } = this.props;
    const { selected } = this.state;
    return (
      <div className="addable-list compact-list">
        <ListGroup>
          {
            // ListRowItem is an injected component that will be rendered as item
            data.map((d, index) => {
              const rowId = getRowId ? getRowId(d) : index;
              return (
                <ListRowItem
                  rowId={rowId}
                  key={rowId}
                  data={d}
                  onRowDelete={() => onRowDelete(rowId)}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  // in the rest of the props are custom properties per item, see
                  {...props}
                />
              );
            })
          }
          <ListGroupItem>
            <FormGroup>
              <Col sm={12}>
                <InputGroup bsSize="sm">
                  <Typeahead
                    id={id}
                    bsSize="sm"
                    ref={(typeahead) => {
                      this.typeahead = typeahead;
                    }}
                    options={options}
                    onChange={this.onChange}
                    selected={selected}
                    placeholder="Start by typing"
                  />
                  <InputGroup.Button>
                    <Button
                      bsStyle="success"
                      onClick={this.onAddItem}
                      disabled={
                        !(
                          !!selected && selected.length > 0
                        ) /* disabled when selected is undefined or empty array */
                      }
                      title="Add to this list"
                    >
                      <Glyphicon glyph="plus" />
                      {' '}
                      Add
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
