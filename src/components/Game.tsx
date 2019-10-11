import React from 'react';
import styled from 'styled-components';

import GameControls from './GameControls';
import GameBoard from './GameBoard';

import * as Measures from './../utility/measures';
import * as Async from './../utility/async';
import * as GameConfig from './../utility/gameConfig';

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

    //=========================================================================
    // Statics
    //=========================================================================

    public static defaultProps = {
        clickSoundFile: process.env.PUBLIC_URL + "/audio/click.wav",
        accentedClickSoundFile: process.env.PUBLIC_URL + "/audio/click_accented.wav",
        barsToPlay: GameConfig.BarsToPlay,
    };

    public static defaultState = {
        playing: false,
        timeSignature: GameConfig.DefaultTimeSignature,
        bpm: GameConfig.DefaultBPM,
        currentBeat: 0,
        countingDown: false,
        scorePerBeat: [],
    };

    //=========================================================================
    // Properties
    //=========================================================================

    private ticker: Async.Ticker | undefined = undefined;
    
    private beatsToPlay: number = 0;
    private msPerBeat: number = 0;
    private beatTimes: number[] = [];

    private clickSound = new Audio(Game.defaultProps.clickSoundFile);
    private accentedClickSound = new Audio(Game.defaultProps.accentedClickSoundFile);

    //=========================================================================
    // Constructor
    //=========================================================================

    public constructor(props: GameProperties) {
        super(props);
        this.state = Game.defaultState;
        this.recalculateTemporaries();
    }

    //=========================================================================
    // Methods
    //=========================================================================

    private playClickSound(accented: boolean) {
        let sound = accented ? this.accentedClickSound : this.clickSound;
        if (sound.paused)
            sound.play();
        else
            sound.currentTime = 0;
    }

    private recalculateTemporaries() {
        this.beatsToPlay = this.state.timeSignature.beatCount * this.props.barsToPlay;
        this.msPerBeat = this.state.timeSignature.beatLength.toMilliseconds(this.state.bpm);
    }

    private updateScore(beat: number, score: number) {
        this.setState((prevState, props) => ({
            scorePerBeat: prevState.scorePerBeat.map((v, i) => v === GameConfig.Score.Unknown ? (i === beat ? score : v) : v)
        }));
    }

    //=========================================================================
    // Event handlers
    //=========================================================================

    private onSettingsChange(newTimeSignature: Measures.TimeSignature, newBPM: number) {
        this.setState((prevState, props) => ({
            currentBeat: 0,
            timeSignature: newTimeSignature,
            bpm: newBPM,
            scorePerBeat: new Array<number>(this.beatsToPlay + 1).fill(GameConfig.Score.Unknown)
        }));
    }

    private onTogglePlay() {
        this.setState((prevState, props) => ({
            playing: !prevState.playing
        }));
    }

    private onPlay() {
        this.setState((prevState, props) => ({
            currentBeat: 0,
            countingDown: true,
            scorePerBeat: new Array<number>(this.beatsToPlay + 1).fill(GameConfig.Score.Unknown)
        }));

        this.beatTimes = new Array<number>(this.beatsToPlay + 1).fill(0);

        this.ticker = new Async.Ticker({
            onTick: this.onCountDown.bind(this),
            onFinish: this.onStart.bind(this),
            interval: this.msPerBeat,
        });

        this.ticker.start(this.state.timeSignature.beatCount);
    }

    private onCountDown(counter: number) {
        this.playClickSound(counter === 1);
        this.setState({currentBeat: counter});
    }

    private onStart() {
        setTimeout(() => {this.setState({countingDown: false})}, this.msPerBeat);

        this.ticker = new Async.Ticker({
            onTick: this.onBeat.bind(this),
            onFinish: this.onFinish.bind(this),
            interval: this.msPerBeat,
        });

        this.ticker.start(this.beatsToPlay);
    }

    private onBeat(counter: number) {
        this.playClickSound(counter % this.state.timeSignature.beatCount === 1);
        this.setState({currentBeat: counter});

        // Mark the beat as missed after the "good" time window has passed
        setTimeout(
            () => {
                this.updateScore(counter, GameConfig.Score.Miss);
            },
            this.msPerBeat / 2
        );

        this.beatTimes[counter] = Date.now();
    }

    private onStop() {
        this.setState({
            currentBeat: 0,
            countingDown: false,
            scorePerBeat: new Array<number>(this.beatsToPlay + 1).fill(GameConfig.Score.Unknown)
        });

        if (this.ticker !== undefined)
            this.ticker.stop();
    }

    private onFinish() {
        setTimeout(() => {this.setState({playing: false})}, this.msPerBeat);
    }

    private onTap() {
        if (!this.state.playing || this.state.countingDown)
            return;

        let tapTime = Date.now();
        let beatTime = this.beatTimes[this.state.currentBeat];
        this.updateScore(this.state.currentBeat, GameConfig.getScore(tapTime, beatTime, this.msPerBeat));

        console.log(tapTime - beatTime);
    }

    //=========================================================================
    // React overloads
    //=========================================================================

    public componentDidUpdate(prevProps: GameProperties, prevState: GameState) {
        if (this.state.bpm !== prevState.bpm || this.state.timeSignature !== prevState.timeSignature)
            this.recalculateTemporaries();

        if (this.state.playing !== prevState.playing) {
            if (this.state.playing)
                this.onPlay();
            else
                this.onStop();
        }
    }

    public render() {
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
                    onClick={this.onTap.bind(this)}
                />
            </Container>
        )
    }
}
