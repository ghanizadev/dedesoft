import React from 'react';
import styled from 'styled-components';

const Container = styled.span`
    padding: 5px;
`;

const DatePick = props => {
    return(
        <Container>
            <input type="date" {...props} />
        </Container>
    );
}

export default DatePick;