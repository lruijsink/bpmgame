import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 200px;
    height: 60px;
    padding: 0;
    margin: 0;
    display: table;
    table-layout: fixed;
    vertical-align: top;
`

const InnerContainer = styled.div`
    display: table;
    width: 100%;
    height: 100%;
    table-layout: fixed;
`

const ButtonContainer = styled.div`
    height: 100%;
    width: 25%;
    display: table-cell;
    table-layout: fixed;
`

const Button = styled.button`
    height: 100%;
    width: 100%;
    background: palevioletred;
    border-radius: 10px;
    border: none;
    color: white;
    margin: 0;
    padding: 0;
    font-size: 30px;

    :hover {
        background: rebeccapurple;
    }
`

const ValueContainer = styled.div`
    display: table-cell;
    width: 50%;
    margin: 0;
    padding: 0;
    table-layout: fixed;
    background: grey;
    border-radius: 10px;
    border: none;
    vertical-align: middle;
`

const Value = styled.span`
`

type NumericSelectorProperties = {default: number, options: Array<number>};

export default class NumericSelector extends React.Component<NumericSelectorProperties, {index: number}> {
    constructor(props: NumericSelectorProperties) {
        super(props);
        let index: number = props.options.findIndex((v, i, o) => v == props.default);
        if (index < 0) index = 0;
        this.state = {index: index};
    }

    decrement() {
        this.setState((state, props) => (
            {index: Math.max(state.index - 1, 0)}
        ));
    }

    increment() {
        this.setState((state, props) => (
            {index: Math.min(state.index + 1, props.options.length - 1)}
        ));
    }

    render() {
        return (
            <Container>
                <InnerContainer>
                    <ButtonContainer>
                        <Button onClick={this.decrement.bind(this)}>-</Button>
                    </ButtonContainer>
                    <ValueContainer>
                        <Value>{this.props.options[this.state.index]}</Value>
                    </ValueContainer>
                    <ButtonContainer>
                        <Button onClick={this.increment.bind(this)}>+</Button>
                    </ButtonContainer>
                </InnerContainer>
            </Container>
        )
    }
}
