import React from 'react';
import styled from 'styled-components';

import * as Measures from './../utility/measures';
import * as Async from './../utility/async';

const Container = styled.div`
    width: 29.4em;
    height: 10em;
    margin: 0.3em;
    margin-top: 0;
    background: var(--panel-bg-color);
    border: none;
    border-radius: 0.5em;
`

const CountDown = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
`

const CountDownMessage = styled.div`
`

const CountDownCounter = styled.div`
`

interface GameBoardProperties {
    timeSignature: Measures.TimeSignature;
    barsToPlay: number;
    currentBeat: number;
    countingDown: boolean;
    scorePerBeat: number[];
    onClick: () => void;
}

interface GameBoardState {
}

export default class GameBoard extends React.Component<GameBoardProperties, GameBoardState> {

    constructor(props: GameBoardProperties) {
        super(props);
    }

    render() {
        let content;
        if(this.props.countingDown) {
            content = (
                <CountDown>
                    <CountDownMessage>Counting down, get ready!</CountDownMessage>
                    <CountDownCounter>{this.props.currentBeat > 0 ? this.props.currentBeat : ""}</CountDownCounter>
                </CountDown>
            );
        }
        else {
            content = (
                <div>
                    {this.props.timeSignature.beatCount} / {this.props.timeSignature.beatLength.units}<br />
                    {this.props.currentBeat}
                </div>
            );
        }

        return (
            <Container onClick={this.props.onClick}>
                {content}
            </Container>
        );
    }
}
