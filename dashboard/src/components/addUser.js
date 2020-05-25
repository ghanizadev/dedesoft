import React from 'react';
import styled from 'styled-components';
import Dropdown from './dropdown';

const Container = styled.div`
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333;
    opacity: 0.15;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

const Box = styled.div`
    width: 25vw;
    padding: 15px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
`;

const Title = styled.p`
    font-size: 14pt;
    font-weight: 500;
    margin: 0 0 15px 0;
`;

const Input = styled.input`
    width: 100%;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin: 5px 0;
    padding: 0 10px;
    color: #333;
`;

const Label = styled.label`
    color: #333;
    font-size: 10pt;
    font-weight: 300;
    margin: 5px 0;
`;

const Button = styled.button`
    width: 100%;
    height: 30px;
    border: none;
    border-radius: 3px;
    margin: 5px 0;
    background-color: #00de89;
    color: white;
    font-weight: 500;
    transition: filter 0.25s ease;

    &:hover{
        filter: brightness(.95);
    }
`;

const AddUser = props => {
    const [state, setState] = React.useState({password: 'default', role: 'seller'});
    return(
        <>
        <Container style={{display: props.visible ? 'flex' : 'none'}} />
        <Box style={{display: props.visible ? 'flex' : 'none'}}>
            <Title>
                Adicionar vendedor
            </Title>
            <Label>
                Nome: 
                <Input onChange={(e) => setState({...state, name: e.target.value })} type="text" placeholder={"ex.: 12"} />
            </Label>
            <Label>
                Login:
                <Input onChange={(e) => setState({...state, code: e.target.value })} type="text" placeholder={"ex.: 032549899"} />
            </Label>
            <Label>
                Atributos:
                <Dropdown
                    onChange={(e) => setState({...state, role: e.target.value })}
                    data={[
                    {label: "Vendedor", value: "seller"},
                    {label: "Caixa", value: "cashier"}
                ]}/>
            </Label>
            <Button
            onClick={()=> {
                if(!state.name){
                    window.alert("Por favor, informe o nome do vendedor.")
                } else if(!state.code){
                    window.alert("Por favor, informe login do vendedor.")
                } else if(!state.role){
                    window.alert("Por favor, informe o atributo.")
                }else
                    props.onSubmit(state);
            }}
            >Salvar</Button>
            <Button
            style={{backgroundColor: "tomato"}}
            onClick={()=> props.onClose()}
            >Cancelar</Button>
        </Box>
        </>
    );
}
export default AddUser;