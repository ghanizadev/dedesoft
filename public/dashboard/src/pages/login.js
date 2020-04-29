import React from 'react';
import styled from 'styled-components';
import { MdCopyright } from 'react-icons/md';
import {login} from '../services';
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router-dom';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

const Button = styled.button`
    width: 100%;
    height: 30px;
    border: none;
    border-radius: 3px;
    margin: 5px 0;
    background-color: #00de89;
    color: white;
    font-weight: 500;
`;

const Box = styled.section`
    width: 25%;
    border-radius: 5px;
    box-shadow: 1px 1px 8px #ddd;
    padding: 50px;
    min-width: 300px;
`;

const Title = styled.p`
    font-weight: 500;
    color: #333;
    margin: 0 0 15px 0;
`;

const CopyRight = styled.div`
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    & a {
        text-decoration: none;
        color: #333;
        font-size: 8pt;
        font-weight: 300;
        margin: 0 5px;
    }
`;

const Login = props => {
    const [state, setState] = React.useState({});
    const [ , setCookie] = useCookies(['authorization']);
    const history = useHistory();

    return(
        <Container>
            <Box>
                <Title>
                    DedéSoft v0.0.1
                </Title>
                <Input onChange={e => setState({...state, username: e.target.value})} type="text" placeholder="Usuário" />
                <Input onChange={e => setState({...state, password: e.target.value})} type="password" placeholder="Senha" />
                <Button
                onClick={async () => {
                    login(state)
                    .then(response => {
                        switch(response.status){
                            case 200:
                                setCookie('authorization', response.data);
                                history.push('/dashboard');
                                break;
                            case 401:
                                window.alert("Usuário e/ou senha incorretos.");
                                break;
                            default:
                                window.alert("Erro inesperado, verifique o status do servidor.");
                                break;
                        }
                    })
                }}
                >Entrar</Button>
                <a href="/nova-senha">Está em senha?</a>
            </Box>
            <CopyRight>
                <a style={{margin: 'auto'}} href="https://ghanizadev.github.io" rel="noopener noreferrer" target="_blank">ghanizadev, 2020</a>
            </CopyRight>
        </Container>
    );
}

export default Login;