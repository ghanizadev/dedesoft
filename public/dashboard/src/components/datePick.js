import React from 'react';
import styled from 'styled-components';

const Container = styled.span`
    padding: 5px;
`;

const DatePick = props => {
    const {date} = props;
    let value;

    function pad(number) {
        if (number < 10) {
        return '0' + number;
        }
        return number;
    }
    if(date){
        value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    return(
        <Container>
            <input type="date" value={value} {...props} />
        </Container>
    );
}

export default DatePick;