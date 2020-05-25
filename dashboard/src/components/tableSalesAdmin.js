import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import * as Icon from 'react-icons/md';
import {paySales, deleteSales, alterSales} from '../services';
import {useCookies} from 'react-cookie';
import CheckBill from './checkBill';
import DatePick from '../components/datePick';
import {Context} from '../context';

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
    bottom: 15px;
    right: 15px;
    position: absolute;
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
    margin: 0 10px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    transition: filter 0.25s ease;

    &:hover{
        filter: invert(0.1);
    }

    & svg {
        margin: auto;
    }
`;

const ItemButton = styled.button`
    border: none;
    padding: 5px;
    background-color: transparent;
    font: inherit;
    cursor: pointer;
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

export default props => {
    const [selected, setSelected] = React.useState([]);
    const [selectedOne, setSelectedOne] = React.useState({});
    const [toggleCheck, setToggleCheck] = React.useState(false);
    const [cookies] = useCookies();

    const state = useContext(Context);

    useEffect(()=> {
        console.log(selected)
    }, [selected])

    const saveDate = (date, type) => {
        state.setContext({
            ...state.context,
            sales: {
                ...state.context.sales,
                [`${type}Date`]: date,
            }
        })
    }

    return(
    <Context.Consumer>
        {({context}) => {
            const sales = context.sales.data;

            const checkAll = () => {
                if(sales.docs && sales.docs.length > 0){
                    const arr = sales.docs.filter(item => item.paid === false);
                    if(arr.length === 0) return false;
                    return arr.length === selected.length;
                }
                else return false
            }

            return(
                <>
                    <CheckBill 
                        visible={toggleCheck}
                        data={selectedOne}
                        onClose={() => setToggleCheck(false)}
                        onPay={async id => {
                            const option = window.confirm('Deseja realmente PAGAR esta nota?');
                            if(option)
                                await paySales( [{id}], cookies.authorization.access_token)
                                .then(() =>{
                                    setToggleCheck(false);
                                    props.onRefresh();
                                } 
                                ).catch(() => window.alert("Falha ao pagar esta fatura."));
                        }}
                        onAlter={async body => {
                            const option = window.confirm('Deseja realmente ALTERAR esta nota?');
                            if(option)
                                await alterSales( [body], cookies.authorization.access_token)
                                .then(() => {
                                    setToggleCheck(false);
                                    props.onRefresh();
                                }).catch((e) => {
                                    console.log(e);
                                    window.alert("Falha ao alterar esta fatura.")
                                });

                                setSelected([]);
                        }}
                        onDelete={async id => {
                            const option = window.confirm('Deseja realmente DELETAR esta nota?');
                            if(option)
                                await deleteSales( [{id}], cookies.authorization.access_token)
                                .then(() => {
                                    setToggleCheck(false);
                                    props.onRefresh();
                                }).catch(() => window.alert("Falha ao deletar esta fatura."));

                                setSelected([]);
                        }}
                    />
                    <Container>
                        <ActionList>
                            <h4>
                                Vendas
                            </h4>
                            <ActionNav>
                                <label>
                                    Entre
                                    <DatePick
                                    value={context.sales.startDate}
                                    onChange={(e) => {
                                        saveDate(e.target.value, 'start');
                                    }} />
                                </label>
                                <label>
                                    e
                                    <DatePick
                                    value={context.sales.endDate}
                                    onChange={(e) => {
                                        saveDate(e.target.value, 'end');
                                    }} />
                                </label>
                                <ActionButton
                                    onClick={() => props.onRefresh()}
                                >
                                    <Icon.MdRefresh size={24} />
                                </ActionButton>
                                <ActionButton
                                disabled={selected.length === 0}
                                onClick={()=> {
                                    const option = window.confirm(`Deseja realmente PAGAR estes ${selected.length} items?`);
                                    if(option)
                                        props.onPay(selected, sales.currentPage);
                                }}
                                >
                                    <Icon.MdAttachMoney size={24} />
                                </ActionButton>
                                <ActionButton
                                disabled={selected.length === 0}
                                onClick={()=> {
                                    const option = window.confirm(`Deseja realmente DELETAR estes ${selected.length} items?`);
                                    if(option)
                                        props.onDelete(selected, sales.currentPage)
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
                                                console.log(selected);
                                                if(sales.docs){
                                                    if(!e.target.checked) return setSelected([]);

                                                    const arr = sales.docs.filter(item => item.paid === false);
                                                    setSelected(arr);
                                                };
                                            }}
                                        />
                                    </InputContainer>
                                    <TableHeader style={{textAlign: 'left'}}>Nº do pedido</TableHeader>
                                    <TableHeader>Valor</TableHeader>
                                    <TableHeader>Vendedor</TableHeader>
                                    <TableHeader>Data</TableHeader>
                                    <TableHeader>Situação</TableHeader>
                                </tr>
                                {sales.docs && sales.docs.map(item => {
                                    return (
                                        <Row key={item.id}>
                                            <InputContainer>
                                                <input type="checkbox"
                                                disabled={item.paid}
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
                                            <RowItem style={{ textAlign: "left" }}>
                                            <ItemButton
                                                onClick={() => {
                                                    setSelectedOne(item);
                                                    setToggleCheck(true);
                                                }}
                                                >{item.code}</ItemButton></RowItem>
                                            <RowItem>R$ {Number(item.value).toFixed(2).replace(".", ",")}</RowItem>
                                            <RowItem>{item.seller.name}</RowItem>
                                            <RowItem>{new Date(item.createdAt).toLocaleDateString()}</RowItem>
                                            <RowItem style={{color: item.paid ? "#00de89" : "tomato" }}>{item.paid ? "Pago" : "Aguardando pagamento"}</RowItem>
                                        </Row>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <Pagination>
                            <span style={{fontSize: "10pt"}}>
                            Exibindo {sales.count}-{sales.totalCount}
                            </span>
                            <span>
                                <PageArrow
                                    disabled={sales.currentPage === 1}
                                    onClick={() => {
                                        props.previousPage(sales.currentPage);
                                        setSelected([]);
                                    }}
                                >
                                    <Icon.MdKeyboardArrowLeft size={18} />
                                </PageArrow>
                                <PageArrow
                                    type="button"
                                    disabled={sales.pages === sales.currentPage}
                                    onClick={() =>{
                                        props.nextPage(sales.currentPage);
                                        setSelected([]);
                                    }}
                                >
                                    <Icon.MdKeyboardArrowRight size={18} />
                                </PageArrow>
                            </span>
                        </Pagination>
                    </Container>
                </>
            )
        }}
        
    </Context.Consumer>
    );
}