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

interface GameControlsProperties {
    playing: boolean;
    onSettingsChange: (newSettings: GameSettings) => void;
    onTogglePlay: () => void;
}

interface GameControlsState {
    timeSignature: Measures.TimeSignature;
    bpm: number;
}

export default class GameControls extends React.Component<GameControlsProperties, GameControlsState> {

    //=========================================================================
    // Methods
    //=========================================================================

    public constructor(props: GameControlsProperties) {
        super(props);

        this.state = {
            timeSignature: GameConfig.DefaultTimeSignature,
            bpm: GameConfig.DefaultBPM
        };
    }

    //=========================================================================
    // Event handlers
    //=========================================================================

    private onUpdateBPM(newBPM: number) {
        this.setState((state, props) => ({
            bpm: newBPM
        }));
    }

    private onUpdateTimeSignatureCount(newCount: number) {
        this.setState((state, props) => ({
            timeSignature: new Measures.TimeSignature(newCount, state.timeSignature.beatLength)
        }));
    }

    private onUpdateTimeSignatureLength(newValue: number) {
        let newLength = new Measures.TimeSpan(Measures.Note.Whole.units / newValue);
        this.setState((state, props) => ({
            timeSignature: new Measures.TimeSignature(state.timeSignature.beatCount, newLength)
        }));
    }

    private onTogglePlay() {
        this.props.onTogglePlay();
    }

    //=========================================================================
    // React overloads
    //=========================================================================

    public componentDidUpdate(prevProps: GameControlsProperties, prevState: GameControlsState) {
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

    public render() {
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
