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

    :disabled {
        background: grey;
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

interface NumericSelectorProperties {
    value?: number;
    options?: number[];
    minimum?: number;
    maximum?: number;
    disabled?: boolean;
    onChange?: (v: number) => void;
};

interface NumericSelectorState {
    index: number;
};

export default class NumericSelector extends React.Component<NumericSelectorProperties, NumericSelectorState> {
    lastValue: number;
    options: number[];
    disabled: boolean;

    constructor(props: NumericSelectorProperties) {
        super(props);

        // If options property is not set, default to [n..m] where n and m are
        // inclusive lower and upper bounds, defaulting to [0..99].
        let options = props.options;
        if (options === undefined) {
            let minimum = props.minimum !== undefined
                        ? props.minimum
                        : 0;
            let maximum = props.maximum !== undefined
                        ? props.maximum
                        : 99;
            
            if (maximum < minimum)
                maximum = minimum;

            let span = maximum - minimum + 1;
            options = Array<number>(span);
            for(let i = 0; i < span; i++)
                options[i] = minimum + i;
        }
        this.options = options;

        let value = props.value !== undefined
                  ? props.value
                  : this.options[0];
        this.lastValue = value;

        let index: number = this.options.findIndex((v, i, o) => v === value);
        if (index < 0)
            index = 0;

        this.disabled = this.props.disabled !== undefined && this.props.disabled;

        this.state = {
            index: index
        };
    }

    decrement() {
        this.setState((state, props) => (
            {index: Math.max(state.index - 1, 0)}
        ));
    }

    increment() {
        this.setState((state, props) => (
            {index: Math.min(state.index + 1, this.options.length - 1)}
        ));
    }

    componentDidUpdate(newProps: NumericSelectorProperties, newState: NumericSelectorState) {
        this.disabled = this.props.disabled !== undefined && this.props.disabled;

        // Only call callback if value actually changed.
        let newValue = this.options[this.state.index];
        if(newValue === this.lastValue)
            return;
        this.lastValue = newValue;

        if(this.props.onChange !== undefined)
            this.props.onChange(newValue);
    }

    render() {
        return (
            <Container>
                <InnerContainer>
                    <ButtonContainer>
                        <Button
                            onClick={this.decrement.bind(this)}
                            disabled={this.disabled || this.state.index == 0}>-</Button>
                    </ButtonContainer>
                    <ValueContainer>
                        <Value>{this.options[this.state.index]}</Value>
                    </ValueContainer>
                    <ButtonContainer>
                        <Button
                            onClick={this.increment.bind(this)}
                            disabled={this.disabled || this.state.index == this.options.length - 1}>+</Button>
                    </ButtonContainer>
                </InnerContainer>
            </Container>
        )
    }
}
