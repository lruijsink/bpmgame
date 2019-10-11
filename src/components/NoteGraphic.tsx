import React from 'react';
import styled from 'styled-components';

import * as Measures from './../utility/measures';
import * as GameConfig from './../utility/gameConfig';

const Note = styled.div`
    margin-left: -1em;
    margin-right: -1em;
`

const PendingNote = styled(Note)`
    opacity: 0.3;
`

const NoteImg = styled.img`
    width: 1em;
    border-top: 0.4em solid transparent;
`

const PerfectNoteImg = styled(NoteImg)`
    border-color: var(--perfect-note-color);
`

const GoodNoteImg = styled(NoteImg)`
    border-color: var(--good-note-color);
`

const MissedNoteImg = styled(NoteImg)`
    border-color: var(--missed-note-color);
`

interface NoteGraphicProperties {
    beatLength: Measures.TimeSpan;
    played: boolean;
    score: number;
}

interface NoteGraphicState {
}

export default class NoteGraphic extends React.Component<NoteGraphicProperties, NoteGraphicState> {
    public render() {
        let lengthUnitsToSVG = new Map([
            [Measures.Note.Whole.units,     "WholeNote.png"],
            [Measures.Note.Half.units,      "HalfNote.png"],
            [Measures.Note.Quarter.units,   "QuarterNote.png"],
            [Measures.Note.Eighth.units,    "EighthNote.png"],
            [Measures.Note.Sixteenth.units, "SixteenthNote.png"]
        ]);

        let src = process.env.PUBLIC_URL + "/svg/" + lengthUnitsToSVG.get(this.props.beatLength.units);

        let img = <NoteImg src={src} />
        if (this.props.score === GameConfig.Score.Perfect)
            img = <PerfectNoteImg src={src} />
        else if (this.props.score === GameConfig.Score.Good)
            img = <GoodNoteImg src={src} />
        else if (this.props.score === GameConfig.Score.Miss)
            img = <MissedNoteImg src={src} />

        return this.props.played
             ? <Note>{img}</Note>
             : <PendingNote>{img}</PendingNote>;
    }
}
