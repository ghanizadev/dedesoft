import React from 'react';
import styled from 'styled-components';

const Select = styled.select`
    border: none;
    color: #333;
    height: 30px;
    border: 1px solid #ddd;
    width: 100%;
    border-radius: 3px;
    padding: 5px;
`;

const Option = styled.option`
    color: #333;
`;

const Dropdown = (props) => {
    const { data } = props;
    return(
        <Select {...props} defaultValue="seller">
            {data.map(item => 
                <Option value={item.value}>{item.label}</Option>
            )}
        </Select>
    )
}

export default Dropdown;