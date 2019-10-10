import React from 'react';
import styled from 'styled-components';
import {StyledButton} from './StyledButton'; 

const Container = styled.div`
    width: 5em;
    height: 2em;
    padding: 0;
    display: table;
    table-layout: fixed;
    vertical-align: top;
    border-spacing: 0;
    margin-bottom: 0.2em;
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

const Button = styled(StyledButton)`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: inherit;
`

const LeftButton = styled(Button)`
    border-radius: 0.5em 0 0 0.5em;
`

const RightButton = styled(Button)`
    border-radius: 0 0.5em 0.5em 0;
`

const ValueContainer = styled.div`
    background: var(--control-bg-color);
    display: table-cell;
    width: 50%;
    margin: 0;
    padding: 0;
    table-layout: fixed;
    vertical-align: middle;
    border: 0.1em solid var(--control-border-color);
    border-left: none;
    border-right: none;
`

const Value = styled.span`
    font-size: inherit;
`

const DisabledValue = styled(Value)`
    color: var(--disabled-font-color);
`

interface NumericSelectorProperties {
    value: number;
    options: number[];
    disabled: boolean;
    onChange: (v: number) => void;
};

interface NumericSelectorState {
    index: number;
};

export default class NumericSelector extends React.Component<NumericSelectorProperties, NumericSelectorState> {
    public static defaultProps: {
        disabled: false,
        onChange: (v: number) => {}
    }

    constructor(props: NumericSelectorProperties) {
        super(props);

        let index = props.options.findIndex((v, i, o) => v === props.value);
        if (index === -1 || index === undefined)
            index = 0;

        this.state = {
            index: index
        };
    }

    decrement() {
        this.setState((prevState, props) => ({
            index: Math.max(prevState.index - 1, 0)
        }));
    }

    increment() {
        this.setState((prevState, props) => ({
            index: Math.min(prevState.index + 1, props.options.length - 1)
        }));
    }

    componentDidUpdate(prevProps: NumericSelectorProperties, prevState: NumericSelectorState) {
        if(this.state.index !== prevState.index) {
            this.props.onChange(this.props.options[this.state.index]);
        }
    }

    render() {
        let value = this.props.disabled 
                  ? <DisabledValue>{this.props.options[this.state.index]}</DisabledValue>
                  : <Value>{this.props.options[this.state.index]}</Value>;
        return (
            <Container>
                <InnerContainer>
                    <ButtonContainer>
                        <LeftButton
                            onClick={this.decrement.bind(this)}
                            disabled={this.props.disabled || this.state.index === 0}>-</LeftButton>
                    </ButtonContainer>
                    <ValueContainer>
                        {value}
                    </ValueContainer>
                    <ButtonContainer>
                        <RightButton
                            onClick={this.increment.bind(this)}
                            disabled={this.props.disabled || this.state.index === this.props.options.length - 1}>+</RightButton>
                    </ButtonContainer>
                </InnerContainer>
            </Container>
        )
    }
}
