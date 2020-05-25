import React from 'react';
import styled from 'styled-components';

const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 36px;
    height: 18px;

    & input {
        opacity: 0;
        width: 0;
        height: 0;
    }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .25s;
  border-radius: 18px;

  &:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  transition: .25s;
  border-radius: 50%;
}
`;
const Input = styled.input`
    &:checked + ${Slider}{
        background-color: #00de89;
    }

    &:focus + ${Slider} {
        box-shadow: 0 0 1px #ddd;
    }

    &:checked + ${Slider}:before {
        transform: translateX(18px);
    }
`;

export default props => {
    return (
        <Switch>
            <Input type="checkbox" {...props} />
            <Slider />
        </Switch>
    );
}