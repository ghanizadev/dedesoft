import React, { useContext, useEffect } from 'react';
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
    background-color: white;
    height: 32px;
    width: 32px;
    display: flex;
    border-radius: 50%;
    transition: filter 0.25s ease;

    &:hover{
        filter: invert(0.1);
    }
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
    const [selectedItems, setSelectedItems] = React.useState([])
    const [addUser, setAddUser] = React.useState(false);
    const [toggleReset, setToggleReset] = React.useState(false);
    const [cookies] = useCookies();
    const state = useContext(Context);

    const saveDate = (date, type) => {
            state.setContext({
                ...state.context,
                sellers: {
                    ...state.context.sellers,
                    [`${type}Date`]: date,
                }
            })
    }
    
    useEffect(()=> {
        console.log(selectedItems)
    }, [selectedItems])

    return(
        <Context.Consumer>
            {({context}) => {
                const sellers = context.sellers.data;

                const checkAll = () => {
                    if(sellers.docs && sellers.docs.length > 0){
                        return sellers.docs.filter(i => i.role !== 'admin').length === selectedItems.length;
                    }
                    else return false
                }
                return(
                    <>
                    <ResetMessage
                        visible={toggleReset}
                        user={toggleReset ? selectedItems[0].code : ''}
                        onClose={()=> setToggleReset(false)}
                    />
                    <AddUser
                    visible={addUser}
                    onSubmit={async data => {
                        setAddUser(false);
                        await addSeller( data, cookies.authorization.access_token);
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
                                    <DatePick
                                    value={context.sellers.startDate}
                                    onChange={(e)=>{
                                        saveDate(e.target.value, "start");
                                    }}
                                    />
                                </Label>
                                <Label>
                                    e
                                    <DatePick
                                    value={context.sellers.endDate}
                                    onChange={(e)=>{
                                        saveDate(e.target.value, "end");
                                    }}
                                    />
                                </Label>
                                <ActionButton
                                    onClick={() => props.onRefresh(sellers.currentPage)}
                                >
                                    <Icon.MdRefresh size={24} />
                                </ActionButton>
                                <ActionButton
                                    disabled={selectedItems.length === 0}
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
                                disabled={selectedItems.length === 0}
                                onClick={()=> {
                                    const option = window.confirm(`Deseja realmente DELETAR PERMANENTEMENTE estes ${selectedItems.length} usuários?`)
                                    if(option)
                                        props.onDelete(selectedItems, sellers.currentPage);
                                }}
                                >
                                    <Icon.MdDelete size={24} />
                                </ActionButton>
                            </ActionNav>
                        </ActionList>
                        <Table>
                            <tbody>
                                <tr style={{textAlign: 'right'}}>
                                    <InputContainer>
                                        <input
                                            checked={checkAll()}
                                            type="checkbox"
                                            onChange={(e)=>{
                                                if(sellers.docs){
                                                    if(!e.target.checked) return setSelectedItems([]);

                                                    setSelectedItems(sellers.docs.filter(i => i.role !== 'admin'));
                                                };
                                            }}
                                        />
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
            
                                    return (
                                        <Row key={item.id}>
                                            <InputContainer>
                                                <input type="checkbox"
                                                checked={selectedItems.includes(item)}
                                                onChange={()=>{
                                                    if(!selectedItems.includes(item))
                                                        setSelectedItems([...selectedItems, item]);
                                                    else
                                                        setSelectedItems(selectedItems.filter(i => i !== item))
                                                }} />
                                            </InputContainer>
                                            <RowItem style={{ textAlign: "left" }}>{item.id}</RowItem>
                                            <RowItem>{item.name}</RowItem>
                                            <RowItem>{item.role === 'seller' ? "Vendedor" : "Op. de caixa"}</RowItem>
                                            <RowItem>R$ {item.totalSales.toFixed(2).replace(".", ",")}</RowItem>
                                            <RowItem>R$ {item.totalPaid.toFixed(2).replace(".", ",")}</RowItem>
                                            <RowItem>R$ {item.totalOpen.toFixed(2).replace(".", ",")}</RowItem>
                                            <RowItem>R$ {item.comission.toFixed(2).replace(".", ",")}</RowItem>
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
                                        setSelectedItems([]);
                                    }}
                                >
                                    <Icon.MdKeyboardArrowLeft size={18} />
                                </PageArrow>
                                <PageArrow
                                    type="button"
                                    disabled={sellers.pages === sellers.currentPage}
                                    onClick={() =>{
                                        props.nextPage(sellers.currentPage);
                                        setSelectedItems([]);
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