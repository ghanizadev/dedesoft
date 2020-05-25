import React from 'react';
import styled from 'styled-components';
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router-dom';
import jwt from 'jsonwebtoken';

const Container = styled.nav`
    left: 0;
    right: 0;
    top: 0;
    height: 90px;
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
`;

const Main = styled.div`
    width: 100%;
    height: 60px;
    background-color: #00de89;
    box-shadow: 1px 1px 8px #ddd;
    padding: 0 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Bar = styled.div`
    width: 100%;
    height: 30px;
    background-color: whitesmoke;
    box-shadow: 1px 1px 8px #ddd;
    padding: 0 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

const Title = styled.span`
    font-weight: 500;
    font-size: 16pt;
    color: white;
`;

const NavButtons = styled.div`
    font-weight: 500;
    font-size: 12pt;
    color: white;
`;

const Button = styled.button`
    font-weight: 300;
    font-size: 10pt;
    color: white;
    margin-left: 15px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    transition: all 0.25s ease;

    &:hover{
        text-decoration: underline;
    }
`;

const ItemButton = styled.button`
    height: 15px;
    margin: 0 0 0 15px;
    border: none;
    background-color: transparent;
    font-size: 10pt;
    transition: all .25s ease;
    cursor: pointer;

    &:hover{
        text-decoration: underline;
    }
`;

export default props => {
    const [cookies, , removeCookies] = useCookies();
    const history = useHistory()

    const user = jwt.decode(cookies.authorization.access_token);

    return (
        <Container>
            <Main>
            <Title>
                DedéSoft v0.0.1
            </Title>
            <NavButtons>
                <span>Bem vindo, {user.name}!</span>
                <Button
                onClick={()=>{
                    removeCookies('authorization');
                    history.push('/');
                }}
                >Sair</Button>
            </NavButtons>
            </Main>
            <Bar style={{display: props.items ? null : "none"}}>            
                {props.items && props.items.map(item =>{
                    return(
                    <ItemButton
                    key={item.path}
                    onClick={()=> props.onChange(item.path)}
                    >{item.name}</ItemButton>
                    );
                })}
            </Bar>
        </Container>
    );
}