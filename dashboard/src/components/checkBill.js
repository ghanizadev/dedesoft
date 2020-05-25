import React, { useState } from 'react';
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
    width: 25vw;
    padding: 15px;
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    min-width: 320px;
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
    text-align: right;
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
    background-color: ${props => {
        switch(props.id){
            case 'pay': return "#00de89";
            case 'alter': return "#ffc219";
            case 'delete': return "tomato";
            default: return "#00de89"
        }
    }};
    color: white;
    font-weight: 500;
    transition: filter 0.25s ease;

    &:disabled {
        background-color: lightgray;
    }

    &:hover{
        filter: brightness(.95);
    }
`;

const Quit = styled.button`
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 8px;
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: tomato;
    color: white;
    font-weight: 500;
    transition: filter 0.25s ease;

    &:hover{
        filter: brightness(.95);
    }
`;

const CheckBill = props => {
    const [data, setData] = useState(props.data);
    
    const {code, value, createdAt, paid, id} = props.data;

    const [cookies] = useCookies();

    const user = jwt.decode(cookies.authorization.access_token);

    const formated = (value || 0).toFixed(2).replace('.', ',');

    return(
        <>
        <Container style={{display: props.visible ? 'flex' : 'none'}} />
        <Box
            style={{display: props.visible ? 'flex' : 'none'}}
            key={props.data.value ? 'notLoaded' : 'loaded'}
        >
            <Title>
                Informações do pedido
            </Title>
            <Label>
                Vendedor: 
                <Input
                    value={props.data.seller ? props.data.seller.name : user.name }
                    contentEditable={false}
                    disabled={true}
                    type="text"
                />
            </Label>
            <Label>
                Nº do pedido:
                <Input
                    defaultValue={code}
                    disabled={paid}
                    onChange={e => setData({...data, id, code: e.target.value})}
                    type="text"
                />
            </Label>
            <Label>
                Valor do pedido (R$):
                <Input
                    defaultValue={formated}
                    disabled={paid}
                    onChange={e => setData({...data, id, value: Number(e.target.value.replace(",", "."))})}
                    type="text"
                />
            </Label>
            <Label>
                Data:
                <Input
                    disabled={true}
                    value={`${new Date(createdAt).toLocaleDateString()} às ${new Date(createdAt).toLocaleTimeString()}`}
                    contentEditable={false}
                    type="text"
                />
            </Label>
            <Label>
                Situação:
                <Input
                    disabled={true}
                    value={paid ? "Pago" : "Aguardando pagamento"}
                    style={{color: paid ? "#00de89" : "tomato"}}
                    contentEditable={false}
                    type="text"
                />
            </Label>
            <Button
                id="pay"
                disabled={props.seller}
                style={{display: paid ? 'none' : null}}
                onClick={()=> props.onPay(id)}
            >Pagar</Button>
            <Button
                id="alter"
                style={{display: paid ? 'none' : null}}
                onClick={()=> props.onAlter(data)}
            >Alterar</Button>
            <Button
                id="delete"
                style={{display: paid ? 'none' : null}}
                onClick={()=> props.onDelete(id)}
            >Deletar</Button>
            <Quit
                onClick={()=> props.onClose()}
            >&times;</Quit>
        </Box>
        </>
    );
}
export default CheckBill;