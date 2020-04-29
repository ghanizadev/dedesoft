import React from 'react';
import styled from 'styled-components';
import * as Icon from 'react-icons/md';
import DatePick from '../components/datePick';
import AddUser from './addUser';
import ResetMessage from './resetMessage';
import { addSeller } from '../services';
import {useCookies} from 'react-cookie';
import { Context } from '../context';

const Container = styled.div`
    border-radius: 5px;
    background-color: #fdfdfd;
    box-shadow: 1px 1px 15px #ddd;
    margin: 30px;
    padding: 30px;
    position: relative;
    min-height: 560px;
    flex: 1;
`;

const Table = styled.table`
    position: relative;
    width: 100%;
    border-collapse: collapse; 
    overflow: auto;
`;

const TableHeader = styled.th`
    padding: 0 10px;
    font-weight: 500;
`;

const Row = styled.tr`
    height: 40px;
    border-bottom: 1px solid #ddd;
    line-height: 20pt;
    font-weight: 300;
    cursor: pointer;
    text-align: right;

    &:hover{
        background-color: #eee;
    }
`;

const InputContainer = styled.td`
    max-width: 40px;
    height: 40px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Pagination = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin: 5px 0;
    bottom: 30px;
    right: 15px;
    position: absolute;
    background-color: white;
`;

const ActionList = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0;
    padding: 0 15px;
`;

const PageArrow = styled.button`
    border: none;
    padding: 5px;
    margin: 0 10px;
    background-color: transparent;
`;

const ActionButton = styled.button`
    border: none;
    padding: 5px;
    background-color: transparent;
`;

const RowItem = styled.td`
    padding: 0 10px;
`;

const ActionNav = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Label = styled.label`
    font-size: 10pt;
`;

export default props => {
    const [selected, setSelected] = React.useState([]);
    const [addUser, setAddUser] = React.useState(false);
    const [toggleReset, setToggleReset] = React.useState(false);
    const [cookies] = useCookies();

    React.useEffect(()=> {
        console.log(selected);
    }, [selected])

    return(
        <Context.Consumer>
            {({context}) => {
                const sellers = context.sellers.data;
                return(
                    <>
                    <ResetMessage
                        visible={toggleReset}
                        user={selected}
                        onClose={()=> setToggleReset(false)}
                    />
                    <AddUser
                    visible={addUser}
                    onSubmit={async data => {
                        setAddUser(false);
                        await addSeller(data, cookies.authorization.access_token);
                        props.onRefresh(sellers.currentPage);
                    }}
                    onClose={() => {
                        setAddUser(false);
                    }}/>
                    <Container>
                        <ActionList>
                            <h4>
                                Vendedores
                            </h4>
                            <ActionNav>
                                <Label>
                                    Entre 
                                    <DatePick onChange={()=>{}} />
                                </Label>
                                <Label>
                                    e
                                    <DatePick onChange={()=>{}} />
                                </Label>
                                <ActionButton
                                    onClick={() => props.onRefresh(sellers.currentPage)}
                                >
                                    <Icon.MdRefresh size={24} />
                                </ActionButton>
                                <ActionButton
                                    disabled={selected.length === 0}
                                    onClick={() => {
                                        setToggleReset(true);
                                    }}
                                >
                                    <Icon.MdVpnKey size={24} />
                                </ActionButton>
                                <ActionButton
                                    onClick={() => setAddUser(true)}
                                >
                                    <Icon.MdAdd size={24} />
                                </ActionButton>
                                <ActionButton
                                disabled={selected.length === 0}
                                onClick={()=> props.onDelete(selected, sellers.currentPage)}
                                >
                                    <Icon.MdDelete size={24} />
                                </ActionButton>
                            </ActionNav>
                        </ActionList>
                        <Table>
                            <tbody>
                                <tr style={{textAlign: 'right'}}>
                                    <InputContainer>
                                        <input type="checkbox" checked={sellers.docs.length === selected.length} onChange={()=>{setSelected(sellers.docs)}} />
                                    </InputContainer>
                                    <TableHeader style={{textAlign: 'left'}}>ID</TableHeader>
                                    <TableHeader>Nome</TableHeader>
                                    <TableHeader>Cargo</TableHeader>
                                    <TableHeader>Total de vendas</TableHeader>
                                    <TableHeader>Total pago</TableHeader>
                                    <TableHeader>Total em aberto</TableHeader>
                                    <TableHeader>Comissão (0,25%)</TableHeader>
                                </tr>
                                {sellers.docs && sellers.docs.map(item => {
                                    if(item.role === 'admin') return null;
            
                                    const total = item.sales.reduce((acc, sale) => acc + sale.value, 0);
            
                                    let open = 0;
                                    let paid = 0;
            
                                    item.sales.forEach((sale) =>{
                                        if(sale.paid) paid += sale.value;
                                        else open += sale.value;
                                    }, 0);
            
                                    const commission = paid * 0.0025;
            
                                    return (
                                        <Row key={item.id}>
                                            <InputContainer>
                                                <input type="checkbox"
                                                checked={selected.includes(item)}
                                                onChange={()=>{
                                                    const arr = selected;
                                                    if(!selected.includes(item)){
                                                        setSelected(arr.concat([item]));
                                                    } else {
                                                        setSelected(arr.filter(i => i !== item))
                                                    }
                                                }} />
                                            </InputContainer>
                                            <RowItem style={{ textAlign: "left" }}>{item.id}</RowItem>
                                            <RowItem>{item.name}</RowItem>
                                            <RowItem>{item.role === 'seller' ? "Vendedor" : "Op. de caixa"}</RowItem>
                                            <RowItem>R$ {Number(total).toFixed(2).replace(".", ",")}</RowItem>
                                            <RowItem>R$ {Number(paid).toFixed(2).replace(".", ",")}</RowItem>
                                            <RowItem>R$ {Number(open).toFixed(2).replace(".", ",")}</RowItem>
                                            <RowItem>R$ {Number(commission).toFixed(2).replace(".", ",")}</RowItem>
                                        </Row>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <Pagination>
                            <span style={{fontSize: "10pt"}}>
                            Exibindo {sellers.count}-{sellers.totalCount}
                            </span>
                            <span>
                                <PageArrow
                                    disabled={sellers.currentPage === 1}
                                    onClick={() => {
                                        props.previousPage(sellers.currentPage);
                                        setSelected([]);
                                    }}
                                >
                                    <Icon.MdKeyboardArrowLeft size={18} />
                                </PageArrow>
                                <PageArrow
                                    type="button"
                                    disabled={sellers.pages === sellers.currentPage}
                                    onClick={() =>{
                                        props.nextPage(sellers.currentPage);
                                        setSelected([]);
                                    }}
                                >
                                    <Icon.MdKeyboardArrowRight size={18} />
                                </PageArrow>
                            </span>
                        </Pagination>
                    </Container>
                    </>
                );
            }}
        </Context.Consumer>
    );
}