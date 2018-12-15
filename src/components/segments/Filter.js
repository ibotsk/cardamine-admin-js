import React, { Component } from 'react';
import {
    Col, Checkbox,
    FormGroup, FormControl, InputGroup,
    Row, Radio,
    Button, Glyphicon,
    Well
} from 'react-bootstrap';

import config from '../../config/config';

const NTYPES_GROUP = config.nomenclature.filter.ntypesGroup;

const ComponentsAvailable = {
    ownership: 'filterrecords',
    ntypes: 'ntypes',
    searchfield: 'searchfield'
};

class Filter extends Component {

    constructor(props, context) {
        super(props, context);

        const initTypes = {};
        for (const g of config.nomenclature.filter.ntypesGroup) {
            initTypes[g] = false;
        }

        this.state = {
            value: '',
            ntypes: {
                All: true,
                ...initTypes
            }
        };
    }

    composeWhere(ntypes, value) {
        const checkedItems = Object.entries(ntypes).filter(entry => entry[1] === true);
        const clauses = [];
        if (checkedItems.some(element => NTYPES_GROUP.includes(element[0]))) {
            const or = [];
            checkedItems.forEach(element => {
                or.push({ ntype: element[0] });
            });
            clauses.push({ or: or });
        }
        if (value && value.length >= this.props.searchFieldMinLength) {
            const or = [];
            this.props.searchFields.forEach(field => {
                or.push({
                    [field]: {
                        like: "%" + value + "%"
                        // options: "i"
                    }
                });
            });
            clauses.push({ or: or })
        }
        if (clauses.length > 1) {
            return { and: clauses };
        }
        return clauses[0] || {};
    }

    handleChange(ntypes, searchValue) {
        const where = this.composeWhere(ntypes, searchValue);
        this.props.onHandleChange(where);
    }

    handleChangeTypes(element) {
        const ntypes = this.state.ntypes;

        ntypes[element.value] = element.checked;

        const isUncheckedGroup = () => {
            return NTYPES_GROUP.filter(t => ntypes[t] === true).length === 0;
        };

        if (NTYPES_GROUP.includes(element.value)) { //clicked element is not All
            ntypes[element.value] = element.checked;
            //check All if no other specific element left checked, uncheck All if any specific element is checked
            ntypes.All = isUncheckedGroup();
        } else {
            // clicked element is All, uncheck rest
            if (ntypes.All === false && isUncheckedGroup()) {
                ntypes.All = true;
            }
            NTYPES_GROUP.forEach(t => {
                ntypes[t] = false;
            });
        }

        this.handleChange(ntypes, this.state.value);
        this.setState({ ntypes: ntypes });
    }

    handleChangeSearch(value) {
        this.handleChange(this.state.ntypes, value);
        this.setState({ value: value });
    }

    renderFilterRecords() {
        if (!this.props.include || !this.props.include.includes(ComponentsAvailable.ownership)) {
            return null;
        }
        return (
            <Col md={2}>
                <h4>View records</h4>
                <FormGroup>
                    <Radio name="filterrecords" disabled={true}>
                        Mine
                            </Radio>
                    <Radio name="filterrecords" disabled={true}>
                        All
                            </Radio>
                </FormGroup>
            </Col>
        );
    }

    renderTypes() {
        if (!this.props.include || !this.props.include.includes(ComponentsAvailable.ntypes)) {
            return null;
        }
        const groupsCheckboxes = [];
        for (const ntype of NTYPES_GROUP) {
            groupsCheckboxes.push(<Checkbox name="ntype" value={ntype} checked={this.state.ntypes[ntype]} onChange={(e) => this.handleChangeTypes(e.target)} >{ntype}</Checkbox>);
        }

        return (
            <Col md={2}>
                <h4>Types</h4>
                <FormGroup>
                    <Checkbox name="ntype" value="All" checked={this.state.ntypes.All} onChange={(e) => this.handleChangeTypes(e.target)} >All</Checkbox>
                    <hr />
                    {groupsCheckboxes}
                </FormGroup>
            </Col>
        );
    }

    renderSearch() {
        if (!this.props.include || !this.props.include.includes(ComponentsAvailable.searchfield)) {
            return null;
        }
        return (
            <Col md={8}>
                <InputGroup>
                    <InputGroup.Button>
                        <Button onClick={() => this.handleChangeSearch('')}>
                            <Glyphicon glyph="erase" />
                        </Button>
                    </InputGroup.Button>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="Search"
                        onChange={(e) => this.handleChangeSearch(e.target.value)}
                    />
                </InputGroup>
                <p>Case sensitive (for now)</p>
            </Col>
        );
    }

    render() {
        if (!this.props.include) {
            return null;
        }
        const filterrecords = this.renderFilterRecords();
        const ntypes = this.renderTypes();
        const searchfield = this.renderSearch();

        return (
            <Well>
                <Row>
                    <form onSubmit={(e) => e.preventDefault()}>
                        {filterrecords}
                        {ntypes}
                        {searchfield}
                    </form>
                </Row>
            </Well>
        );
    }

}

export default Filter;
export { ComponentsAvailable };
