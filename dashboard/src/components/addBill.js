import React from 'react';
import styled from 'styled-components';
import {useCookies} from 'react-cookie';
import jwt from 'jsonwebtoken';

const Container = styled.div`
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333;
    opacity: 0.15;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

const Box = styled.div`
    padding: 15px;
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    width: 320px;
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

const AddBill = props => {
    const [state, setState] = React.useState({});
    const [cookies] = useCookies();
    const user = jwt.decode(cookies.authorization.access_token);

    return(
        <>
        <Container style={{display: props.visible ? 'flex' : 'none'}} />
        <Box style={{display: props.visible ? 'flex' : 'none'}}>
            <Title>
                Adicionar pedido
            </Title>
            <Label>
                Vendedor: 
                <Input
                value={`${user.code} - ${user.name}`}
                disabled={true}
                type="text"
                placeholder={"ex.: 12"} />
            </Label>
            <Label>
                Nº do pedido:
                <Input onChange={(e) => setState({...state, code: e.target.value })} type="text" placeholder={"ex.: 032549899"} />
            </Label>
            <Label>
                Valor do pedido (R$):
                <Input onChange={(e) => setState({...state, value: Number(e.target.value.replace(",", ".")) })} type="text" pattern="[0-9]" placeholder={"ex.: 100,50"}/>
            </Label>
            <Button
            onClick={()=> {
                if(!state.code){
                    window.alert("Por favor, informe Nº do pedido.")
                } else if(!state.value){
                    window.alert("Por favor, informe o valor do pedido.")
                }else
                    props.onSubmit({...state, seller_id: user.id});
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
export default AddBill;