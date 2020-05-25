import React, {useEffect} from 'react';
import styled from 'styled-components';
import {resetPassword} from '../services';
import {useHistory, withRouter} from 'react-router-dom';
import qs from 'qs';

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

    & label {
        font-size: 8pt;
    }
`;

const Title = styled.p`
    font-weight: 500;
    color: #333;
    margin: 0 0 15px 0;
`;

const Login = props => {
    const [state, setState] = React.useState({});
    const history = useHistory();

    const query = qs.parse(props.location.search.substring(1));

    useEffect(()=>{
        setState({...state, username: query.user, code: query.code})
    }, [])

    return(
        <Container>
            <Box>
                <Title>
                    Nova senha
                </Title>
                <label>
                    Usuário:
                    <Input
                        defaultValue={query.user && query.user}
                        onChange={e => setState({...state, username: e.target.value})}
                        type="text"
                        placeholder="Usuário"
                    />
                </label>
                <label>
                    Senha:
                    <Input
                        onChange={e => setState({...state, password: e.target.value})}
                        type="password"
                        placeholder="Senha" />
                </label>
                <label>
                    Repita a senha:
                    <Input
                        onChange={e => setState({...state, confirmPassword: e.target.value})}
                        type="password"
                        placeholder="Confirme sua senha" />
                </label>
                <label>
                    Código de autorização
                    <Input
                        defaultValue={query.code && query.code}
                        onChange={e => setState({...state, code: e.target.value})}
                        type="text" placeholder="Código de autorização"
                    />
                </label>
                <Button
                onClick={async () => {
                    if(!state.password || !state.confirmPassword)
                        return window.alert('Preencha todos os campos para prosseguir.');
                    if(state.password.length < 4 || state.confirmPassword.length < 4)
                        return window.alert('A senha de possuir ao menos 4 digitos.');
                    if(state.password !== state.confirmPassword)
                        return window.alert('Senhas não conferem.');
                    if(!state.code || state.code === '')
                        return window.alert('Preencha o código de autorização.');
                    resetPassword(state)
                    .then(response => {
                        switch(response.status){
                            case 204:
                                window.alert("Senha alterada com sucesso!");
                                history.push('/');
                                break;
                            case 403:
                                window.alert("Código de autorização inválido.");
                                break;
                            default:
                                window.alert("Erro inesperado, verifique o status do servidor.");
                                break;
                        }
                    })
                }}
                >Confirmar</Button>
            </Box>
        </Container>
    );
}

export default withRouter(Login);