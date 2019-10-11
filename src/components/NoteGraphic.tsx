import React from 'react';
import styled from 'styled-components';

import * as Measures from './../utility/measures';

const Note = styled.div`
	margin-left: -1em;
	margin-right: -1em;
`

const PendingNote = styled(Note)`
	opacity: 0.3;
`

const NoteImg = styled.img`
	width: 1em;
`

interface NoteGraphicProperties {
	beatLength: Measures.TimeSpan;
	played: boolean;
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

		let img = <NoteImg src={process.env.PUBLIC_URL + "/svg/" + lengthUnitsToSVG.get(this.props.beatLength.units)} />;
		let note = this.props.played
		         ? <Note>{img}</Note>
		         : <PendingNote>{img}</PendingNote>

		return note;
	}
}
