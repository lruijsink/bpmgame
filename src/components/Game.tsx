import React from 'react';
import styled from 'styled-components';

import GameControls from './GameControls';
import GameBoard from './GameBoard';

import * as Measures from './../utility/measures';
import * as Async from './../utility/async';

const Container = styled.div`
    background-color: var(--main-bg-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: var(--main-font-color);

    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    -o-user-select:none;
    user-select:none;
`

interface GameProperties {
    clickSoundFile: string;
    accentedClickSoundFile: string;
    barsToPlay: number;
}

interface GameState {
    playing: boolean;
    timeSignature: Measures.TimeSignature;
    bpm: number;
    currentBeat: number;
    countingDown: boolean;
    scorePerBeat: number[];
}

export default class Game extends React.Component<GameProperties, GameState> {
    public static defaultProps = {
        clickSoundFile: process.env.PUBLIC_URL + "/audio/click.wav",
        accentedClickSoundFile: process.env.PUBLIC_URL + "/audio/click_accented.wav",
        barsToPlay: 4,
    };

    public static defaultState = {
        playing: false,
        timeSignature: new Measures.TimeSignature(4, Measures.Note.Quarter),
        bpm: 120,
        currentBeat: 0,
        countingDown: false,
        scorePerBeat: [],
    };

    constructor(props: GameProperties) {
        super(props);
        this.state = Game.defaultState;

        this.beatsToPlay = this.state.timeSignature.beatCount * this.props.barsToPlay;
        this.msPerBeat = this.state.timeSignature.beatLength.toMilliseconds(this.state.bpm);
    }

    ticker: Async.Ticker | undefined = undefined;
    beatsToPlay: number = 0;
    msPerBeat: number = 0;
    clickSound = new Audio(Game.defaultProps.clickSoundFile);
    accentedClickSound = new Audio(Game.defaultProps.accentedClickSoundFile);

    playClickSound(accented: boolean) {
        let sound = accented ? this.accentedClickSound : this.clickSound;
        if (sound.paused)
            sound.play();
        else
            sound.currentTime = 0;
    }

    onSettingsChange(newTimeSignature: Measures.TimeSignature, newBPM: number) {
        this.setState((prevState, props) => ({
            timeSignature: newTimeSignature,
            bpm: newBPM
        }));

        this.beatsToPlay = newTimeSignature.beatCount * this.props.barsToPlay;
        this.msPerBeat = newTimeSignature.beatLength.toMilliseconds(newBPM);
    }

    onTogglePlay() {
        this.setState((prevState, props) => ({
            playing: !prevState.playing
        }));
    }

    onFinish() {
        this.setState((prevState, props) => ({
            playing: false
        }));
    }

    onPlay() {
        this.setState({
            currentBeat: 0,
            countingDown: true,
        });

        this.ticker = new Async.Ticker({
            onTick: this.onCountDown.bind(this),
            onFinish: this.onStart.bind(this),
            interval: this.msPerBeat,
        });

        this.ticker.start(this.state.timeSignature.beatCount);
    }

    onCountDown(counter: number) {
        this.playClickSound(counter === 1);
        this.setState({currentBeat: counter});
    }

    onStart() {
        setTimeout(() => {this.setState({countingDown: false})}, this.msPerBeat);

        this.ticker = new Async.Ticker({
            onTick: this.onBeat.bind(this),
            onFinish: this.onFinish.bind(this),
            interval: this.msPerBeat,
        });

        this.ticker.start(this.beatsToPlay);
    }

    onBeat(counter: number) {
        this.playClickSound(counter % this.state.timeSignature.beatCount === 1);
        this.setState({currentBeat: counter});
    }

    onStop() {
        this.setState({
            countingDown: false,
        });

        if (this.ticker !== undefined)
            this.ticker.stop();
    }

    onClick() {
    }

    componentDidUpdate(prevProps: GameProperties, prevState: GameState) {
        if (this.state.playing !== prevState.playing) {
            if (this.state.playing)
                this.onPlay();
            else
                this.onStop();
        }
    }

    render() {
        return (
            <Container>
                <GameControls
                    playing={this.state.playing}
                    onSettingsChange={this.onSettingsChange.bind(this)}
                    onTogglePlay={this.onTogglePlay.bind(this)}
                />
                <GameBoard
                    timeSignature={this.state.timeSignature}
                    barsToPlay={this.props.barsToPlay}
                    currentBeat={this.state.currentBeat}
                    countingDown={this.state.countingDown}
                    scorePerBeat={this.state.scorePerBeat}
                    onClick={this.onClick.bind(this)}
                />
            </Container>
        )
    }
}
