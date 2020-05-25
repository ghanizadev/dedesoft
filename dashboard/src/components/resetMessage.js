import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {useCookies} from 'react-cookie';
import {getResetCode} from '../services';

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
    min-width: 500px;
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

const ResetMessage = props => {
    const [cookies] = useCookies();
    const [url, setUrl] = useState('');
    const [login, setLogin] = useState('');

    useEffect(()=>{
        setLogin(props.user)
    },[props.user])

    const makeUrl = (user, code) => {
        if(user && code){
            return `${window.location.href.split(window.location.pathname)[0]}/nova-senha?code=${code}&user=${user}`;
        }
        return '';
    }

    return(
        <>
        <Container style={{display: props.visible ? null : 'none'}}/>
        <Box
            style={{display: props.visible ? null : 'none'}}
        >
            <Title>
                Solicitar nova senha
            </Title>
            <Label>
                Login: 
                <Input
                    value={login}
                    disabled={true}
                    type="text"
                />
            </Label>
            <Label>
                Gerar código de autorização: 
                <Button
                onClick={async ()=> {
                    await getResetCode( {username: login}, cookies.authorization.access_token)
                    .then(data => {
                        const str = makeUrl(data.username, data.code);
                        console.log(str)
                        setUrl(str);
                    })
                }}
                >Gerar</Button>
                <Input
                    value={""}
                    style={{textAlign: 'center'}}
                    disabled={true}
                    type="text"
                />
                <div style={{minHeight: 80, display: 'flex', alignItems: "center", justifyContent: 'center', textAlign: 'center'}}>
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </div>
            </Label>

            <Quit
                onClick={()=> props.onClose()}
            >&times;</Quit>
        </Box>
        </>
    );
}
export default ResetMessage;