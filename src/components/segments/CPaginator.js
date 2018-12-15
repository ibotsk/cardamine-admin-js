import React, { Component } from 'react';
import { Pagination } from 'react-bootstrap';

const EL_BEGINNING = 'el-beginning';
const EL_END = 'el-end';

class CPaginator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1
        }
    }

    countNumOfPages() {
        return Math.ceil(this.props.totalItems / this.props.recordsPerPage);
    }

    handleSelect(activePage) {
        this.setState({ activePage: activePage });
        this.props.onHandleSelect(activePage);
    }

    createItems(totalPages, activePage, displayRange, numOfElementsAtEnds = 0) {
        let items = [];
        let rangeMin = activePage - Math.floor(displayRange / 2);
        let rangeMax = activePage + Math.floor(displayRange / 2);
        rangeMax = Math.max(rangeMax, displayRange);
        rangeMin = Math.min(rangeMin, totalPages - displayRange + 1);
        const min = Math.max(1, rangeMin);
        const max = Math.min(totalPages, rangeMax);

        //explicit element at the begining
        const maxDisplayedPageAtTheBeginning = numOfElementsAtEnds;
        if (min > maxDisplayedPageAtTheBeginning) {
            const showElements = Math.min(min - numOfElementsAtEnds + 1, numOfElementsAtEnds);
            for (let i = 1; i <= showElements; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === activePage} onClick={() => this.handleSelect(i)}>{i}</Pagination.Item>
                );
            }
        }
        //ellipsis
        if (min > maxDisplayedPageAtTheBeginning + 1) {
            items.push(
                <Pagination.Ellipsis key={EL_BEGINNING} />
            )
        }
        //core elements
        for (let i = min; i <= max; i++) {
            items.push(
                <Pagination.Item key={i} active={i === activePage} onClick={() => this.handleSelect(i)}>{i}</Pagination.Item>
            );
        }
        //ellipsis
        const minDisplayedPageAtTheEnd = totalPages - numOfElementsAtEnds + 1;
        if (max < minDisplayedPageAtTheEnd - 1) {
            items.push(
                <Pagination.Ellipsis key={EL_END} />
            )
        }
         //explicit element at the begining
         if (max < minDisplayedPageAtTheEnd) {
            for (let i = minDisplayedPageAtTheEnd; i <= totalPages; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === activePage} onClick={() => this.handleSelect(i)}>{i}</Pagination.Item>
                );
            }
        }
        return items;
    }

    render() {
        const pages = this.countNumOfPages();
        return (
            <div id='paginator' className='text-center'>
                <Pagination>
                    <Pagination.First onClick={() => this.handleSelect(1)} />
                    <Pagination.Prev onClick={() => this.handleSelect(this.state.activePage - 1)} />
                    {this.createItems(pages, this.state.activePage, this.props.displayRange, this.props.numOfElementsAtEnds)}
                    <Pagination.Next onClick={() => this.handleSelect(this.state.activePage + 1)} />
                    <Pagination.Last onClick={() => this.handleSelect(pages)} />
                </Pagination>
            </div>
        );
    }

}

export default CPaginator;
