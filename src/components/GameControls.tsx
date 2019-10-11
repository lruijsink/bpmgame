import React from 'react';
import styled from 'styled-components';

import * as Measures from './../utility/measures';
import {GameSettings} from './../utility/gameSettings';
import * as GameConfig from './../utility/gameConfig';

import NumericSelector from './NumericSelector';
import {StyledButton} from './StyledButton';

const Container = styled.div`
    width: 30em;
    height: 7em;
    display: table;
    table-layout: fixed;
    border-spacing: 0.3em;
`

const InnerContainer = styled.div`
    display: table-row;
    table-layout: fixed;
`

const Panel = styled.div`
    display: table-cell;
    table-layout: fixed;
    background: var(--panel-bg-color);
    border: none;
    border-radius: 0.5em;
    text-align: center;
`

const BPMPanel = styled(Panel)`
    width: 25%;
`

const TimeSignaturePanel = styled(Panel)`
    width: 25%;
`

const ButtonsPanel = styled(Panel)`
    width: 50%;
`

const PanelLabel = styled.div`
    font-size: 0.7em;
    height: 1.7em;
    padding-top: 0.3em;
    color: var(--label-font-color);
`

const PanelContent = styled.div`
    width: 100%;
    height: 5em;
    vertical-align: middle;
`

const PanelContentContainer = styled.div`
    margin: 0 auto;
    display: inline-block;
`

const PlayButton = styled(StyledButton)`
    font-size: inherit;
    border-radius: 50%;
    border-width: 0.2em;
    height: 4em;
    width: 4em;
`

interface GameControlsProps {
    /**
     * Whether the game is currently in play, also true when counting down.
     */
    playing: boolean;

    /**
     * Callback to call when the settings have changed.
     */
    onSettingsChange: (newSettings: GameSettings) => void;

    /**
     * Callback to call when the play button is toggled.
     */
    onTogglePlay: () => void;
}

interface GameControlsState {
    /**
     * The current time signature that the player has selected.
     */
    timeSignature: Measures.TimeSignature;

    /**
     * The current BPM that the player has selected.
     */
    bpm: number;
}

/**
 * Game controls component that lets the player change the game settings.
 */
export default class GameControls extends React.Component<GameControlsProps, GameControlsState> {

    //=========================================================================
    // Constructor
    //=========================================================================

    public constructor(props: GameControlsProps) {
        super(props);

        this.state = {
            timeSignature: GameConfig.DefaultTimeSignature,
            bpm: GameConfig.DefaultBPM
        };
    }

    //=========================================================================
    // Event handlers
    //=========================================================================

    private onUpdateBPM(newBPM: number): void {
        this.setState((state, props) => ({
            bpm: newBPM
        }));
    }

    private onUpdateTimeSignatureCount(newCount: number): void {
        this.setState((state, props) => ({
            timeSignature: new Measures.TimeSignature(newCount, state.timeSignature.beatLength)
        }));
    }

    private onUpdateTimeSignatureLength(newValue: number): void {
        let newLength = new Measures.TimeSpan(Measures.Note.Whole.units / newValue);
        this.setState((state, props) => ({
            timeSignature: new Measures.TimeSignature(state.timeSignature.beatCount, newLength)
        }));
    }

    private onTogglePlay(): void {
        this.props.onTogglePlay();
    }

    //=========================================================================
    // React overloads
    //=========================================================================

    public componentDidUpdate(prevProps: GameControlsProps, prevState: GameControlsState): void {
        if (this.state.timeSignature.beatCount !== prevState.timeSignature.beatCount
            || this.state.timeSignature.beatLength !== prevState.timeSignature.beatLength
            || this.state.bpm !== prevState.bpm)
        {
            this.props.onSettingsChange(new GameSettings({
                barsToPlay: GameConfig.DefaultBarsToPlay,
                bpm: this.state.bpm,
                timeSignature: this.state.timeSignature
            }));
        }
    }

    public render(): React.ReactNode {
        return (
            <Container>
                <InnerContainer>
                    <BPMPanel>
                        <PanelLabel>
                            BPM
                        </PanelLabel>
                        <PanelContent>
                            <PanelContentContainer>
                                <NumericSelector
                                    value={GameConfig.DefaultBPM}
                                    options={GameConfig.BPMOptions}
                                    disabled={this.props.playing}
                                    onChange={this.onUpdateBPM.bind(this)} />
                            </PanelContentContainer>
                        </PanelContent>
                    </BPMPanel>
                    <TimeSignaturePanel>
                        <PanelLabel>
                            Time signature
                        </PanelLabel>
                        <PanelContent>
                            <PanelContentContainer>
                                <NumericSelector
                                    value={GameConfig.DefaultTimeSignature.beatCount}
                                    options={GameConfig.TimeSignatureCountOptions}
                                    disabled={this.props.playing}
                                    onChange={this.onUpdateTimeSignatureCount.bind(this)} />
                                <NumericSelector
                                    value={Measures.Note.Whole.units / GameConfig.DefaultTimeSignature.beatLength.units}
                                    options={GameConfig.TimeSignatureLengthOptions}
                                    disabled={this.props.playing}
                                    onChange={this.onUpdateTimeSignatureLength.bind(this)} />
                            </PanelContentContainer>
                        </PanelContent>
                    </TimeSignaturePanel>
                    <ButtonsPanel>
                        <PanelLabel>
                            Controls
                        </PanelLabel>
                        <PanelContent>
                            <PanelContentContainer>
                                <PlayButton onClick={this.onTogglePlay.bind(this)}>{this.props.playing ? "Stop" : "Play"}</PlayButton>
                            </PanelContentContainer>
                        </PanelContent>
                    </ButtonsPanel>
                </InnerContainer>
            </Container>
        )
    }
}
