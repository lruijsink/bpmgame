import React from 'react';
import styled from 'styled-components';

import GameControls from './GameControls';
import GameBoard from './GameBoard';

import * as Measures from './../utility/measures';

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

}

interface GameState {
    playing: boolean;
    timeSignature: Measures.TimeSignature;
    bpm: number;
}

export default class Game extends React.Component<GameProperties, GameState> {
    constructor(props: GameProperties) {
        super(props);

        this.state = {
            playing: false,
            timeSignature: new Measures.TimeSignature(4, Measures.Note.Quarter),
            bpm: 120
        };
    }

    onSettingsChange(newTimeSignature: Measures.TimeSignature, newBPM: number) {
        this.setState((prevState, props) => ({
            timeSignature: newTimeSignature,
            bpm: newBPM
        }));
    }

    onTogglePlay() {
        this.setState((prevState, props) => ({
            playing: !prevState.playing
        }));
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
                    playing={this.state.playing}
                    timeSignature={this.state.timeSignature}
                    bpm={this.state.bpm}
                />
            </Container>
        )
    }
}
