import React from 'react';
import styled from 'styled-components';
import * as Measures from './../utility/measures';

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
`

const CountDownMessage = styled.div`
`

const CountDownCounter = styled.div`
`

interface GameBoardProperties {
    playing: boolean;
    timeSignature: Measures.TimeSignature;
    bpm: number;
    barsToPlay: number;
    onFinish: (score: number) => void;
}

interface GameBoardState {
    countingDown: boolean;
    currentBeat: number;
    currentScore: number;
    timerId: number;
}

export default class GameBoard extends React.Component<GameBoardProperties, GameBoardState> {
    public static defaultProps = {
        playing: false,
        timeSignature: new Measures.TimeSignature(4, Measures.Note.Quarter),
        bpm: 120,
        barsToPlay: 4,
        onFinish: (score: number) => {},
    };

    constructor(props: GameBoardProperties) {
        super(props);

        this.state = {
            currentBeat: 0,
            currentScore: 0,
            countingDown: false,
            timerId: 0
        };
    }

    reset() {
        this.setState((prevState, props) => ({
            currentBeat: 0,
            currentScore: 0,
            countingDown: false
        }));
    }

    onTick() {
        if(this.state.countingDown) {
            this.setState((prevState, props) => ({
                currentBeat: prevState.currentBeat !== props.timeSignature.beatCount
                           ? prevState.currentBeat + 1
                           : 0,
                countingDown: prevState.currentBeat !== props.timeSignature.beatCount
            }));
            return;
        }

        if(this.state.currentBeat === this.props.timeSignature.beatCount * this.props.barsToPlay) {
            this.onFinish();
            return;
        }

        this.setState((prevState, props) => ({
            currentBeat: prevState.currentBeat + 1,
            currentScore: prevState.currentScore + 10
        }));
    }

    onPlay() {
        this.setState((prevState, props) => ({
            timerId: setInterval(this.onTick.bind(this), this.props.timeSignature.beatLength.toSeconds(this.props.bpm) * 1000),
            countingDown: true
        }));
    }

    onStop() {
        clearInterval(this.state.timerId);
        this.reset();
    }

    onFinish() {
        clearInterval(this.state.timerId);
        this.props.onFinish(this.state.currentScore);
    }

    onClick() {
        if(!this.props.playing)
            return;
    }

    componentDidUpdate(prevProps: GameBoardProperties, prevState: GameBoardState) {
        if (this.props.playing !== prevProps.playing) {
            if (this.props.playing)
                this.onPlay();
            else
                this.onStop();
            return;
        }
    }

    render() {
        let countDown;
        if(this.state.countingDown) {
            countDown = (
                <CountDown>
                    <CountDownMessage>Counting down, get ready!</CountDownMessage>
                    <CountDownCounter>{this.state.currentBeat > 0 ? this.state.currentBeat : ""}</CountDownCounter>
                </CountDown>
            );
        }

        return (
            <Container onClick={this.onClick.bind(this)}>
                {countDown}
                {this.props.playing ? "Playing" : "Stopped"}<br />
                {this.props.timeSignature.beatCount} / {this.props.timeSignature.beatLength.units}<br />
                {this.props.bpm}<br />
                {this.state.currentBeat} {this.state.currentScore}
            </Container>
        )
    }
}
