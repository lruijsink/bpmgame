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
    width: 100%;
    height: 100%;
    text-align: center;
`

const CountDownMessage = styled.div`
`

const CountDownCounter = styled.div`
`

type Score = number | undefined;

interface GameBoardProperties {
    playing: boolean;
    timeSignature: Measures.TimeSignature;
    bpm: number;
    barsToPlay: number;
    clickSoundFile: string;
    accentedClickSoundFile: string;
    onFinish: (score: number) => void;
}

interface GameBoardState {
    countingDown: boolean;
    currentBeat: number;
    currentScore: number;
    timerId: number;
    scorePerBeat: Score[];
}

export default class GameBoard extends React.Component<GameBoardProperties, GameBoardState> {
    public static defaultProps = {
        playing: false,
        timeSignature: new Measures.TimeSignature(4, Measures.Note.Quarter),
        bpm: 120,
        barsToPlay: 4,
        accentedClickSoundFile: process.env.PUBLIC_URL + "/audio/click_accented.wav",
        clickSoundFile: process.env.PUBLIC_URL + "/audio/click.wav",
        onFinish: (score: number) => {},
    };

    public static defaultState = {
        currentBeat: 0,
        currentScore: 0,
        countingDown: false,
        timerId: 0,
        scorePerBeat: [],
    };

    beatsToPlay: number = 0;
    msPerBeat: number = 0;
    clickSound = new Audio(GameBoard.defaultProps.clickSoundFile);
    accentedClickSound = new Audio(GameBoard.defaultProps.accentedClickSoundFile);

    constructor(props: GameBoardProperties) {
        super(props);

        this.state = GameBoard.defaultState;
    }

    reset() {
        this.setState(GameBoard.defaultState);
    }

    playAudio(audio: any) {
        if(audio.paused)
            audio.play();
        else
            audio.currentTime = 0;
    }

    playClick() {
        if(this.state.currentBeat % this.props.timeSignature.beatCount === 1)
            this.playAudio(this.accentedClickSound);
        else
            this.playAudio(this.clickSound);
    }

    incrementBeat() {
        this.setState((prevState, props) => ({
            currentBeat: prevState.currentBeat + 1
        }));
    }

    onPlay() {
        this.setState((prevState, props) => ({
            timerId: setInterval(this.incrementBeat.bind(this), this.msPerBeat),
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
        if(!this.props.playing || this.state.countingDown)
            return;


    }

    onTick() {
        if(this.state.countingDown) {
            this.onCountDown();

            if(this.state.currentBeat > this.props.timeSignature.beatCount) {
                this.setState((prevState, props) => ({
                    currentBeat: 1,
                    countingDown: false
                }));
            }
        }
        else if(this.state.currentBeat === this.beatsToPlay + 1) {
            this.onFinish();
        }
        else {
            this.onBeat();
        }
    }

    onCountDown() {
        this.playClick();
    }

    onBeat() {
        this.playClick();
    }

    componentDidUpdate(prevProps: GameBoardProperties, prevState: GameBoardState) {
        this.beatsToPlay = this.props.barsToPlay * this.props.timeSignature.beatCount;
        this.msPerBeat = this.props.timeSignature.beatLength.toMilliseconds(this.props.bpm);

        if(this.props.clickSoundFile !== prevProps.clickSoundFile)
            this.clickSound = new Audio(this.props.clickSoundFile);
        
        if(this.props.accentedClickSoundFile !== prevProps.accentedClickSoundFile)
            this.accentedClickSound = new Audio(this.props.accentedClickSoundFile);

        if (this.props.playing !== prevProps.playing) {
            if (this.props.playing)
                this.onPlay();
            else
                this.onStop();
            return;
        }

        if (this.state.currentBeat > 0 && this.state.currentBeat > prevState.currentBeat) {
            this.onTick();
        }
    }

    render() {
        let content;
        if(this.state.countingDown) {
            content = (
                <CountDown>
                    <CountDownMessage>Counting down, get ready!</CountDownMessage>
                    <CountDownCounter>{this.state.currentBeat > 0 ? this.state.currentBeat : ""}</CountDownCounter>
                </CountDown>
            );
        }
        else {
            content = (
                <div>
                    {this.props.playing ? "Playing" : "Stopped"}<br />
                    {this.props.timeSignature.beatCount} / {this.props.timeSignature.beatLength.units}<br />
                    {this.props.bpm}<br />
                    {this.state.currentBeat} {this.state.currentScore}
                </div>
            );
        }

        return (
            <Container onClick={this.onClick.bind(this)}>
                {content}
            </Container>
        );
    }
}
