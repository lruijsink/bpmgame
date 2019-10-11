import styled from 'styled-components';

/**
 * A styled button configured to take on colors as set by the theme CSS.
 */
export const StyledButton = styled.button`
    background: var(--control-color);
    border: 0.1em solid var(--control-border-color);
    border-radius: 0.3em;
    font-size: inherit;

    :hover:enabled {
        background: var(--hovered-control-color);
        border-color: var(--hovered-control-border-color);
    }

    :disabled {
        background: var(--disabled-control-color);
        border-color: var(--disabled-control-border-color);
        color: var(--disabled-font-color);
    }
`
