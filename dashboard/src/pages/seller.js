import React, { useContext, useState } from 'react';
import TableSales from '../components/tableSalesSellers';
import NavBar from '../components/navbar';
import styled from 'styled-components';
import {useCookies} from 'react-cookie';
import {Context} from '../context';
import jwt from 'jsonwebtoken';
import {
  getSaleCode,
  deleteSales,
} from '../services'
import { useHistory } from 'react-router-dom';

const Container = styled.div`
  padding: 90px 0 0 0;
  display: flex;
  flex: row;
  height: 100%;
`;

const Seller = props => {
  const [cookies, , removeCookies] = useCookies();
  const state = useContext(Context);
  const history = useHistory();

  const user = jwt.decode(cookies.authorization.access_token);

  const updateData = async (pageSales) => {
    const sales = state.context.sales;
    const salesData = await getSaleCode(pageSales, user.id, sales, cookies.authorization.access_token)
    .then(d => {
      return d;
    })
    .catch((e) => {
      window.alert(e.message);
      removeCookies('authorization');
      history.push('/')
    })

    state.setContext({
      ...state.context, 
      sales: {
        ...state.context.sales,
        data: salesData
      }
    });
  }

  React.useEffect(() => {
    updateData(1);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

const Home = () => {
    return(
      <Context.Consumer>
        {({context}) => {
          const sales = context.sales.data;

          const user = jwt.decode(cookies.authorization.access_token);      
          return (
            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <div style={{display: 'flex', flexDirection: 'column', margin: 30}}>
                    <h1>{user.name}</h1>
                    <div style={{minHeight: 50}} />
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <span>Total: <h3>R$ {sales.totalSales.toFixed(2).replace('.', ',')}</h3></span>
                        <span>Pago: <h3 style={{color: '#00de89'}}>R$ {sales.totalPaid.toFixed(2).replace('.', ',')}</h3></span>
                        <span>Em aberto: <h3 style={{color: 'tomato'}}>R$ {sales.totalOpen.toFixed(2).replace('.', ',')}</h3></span>
                        <span>Comissão (0,25%): <h3>R$ {sales.comission.toFixed(2).replace('.', ',')}</h3></span>
                    </div>
                </div>
                <TableSales
                  nextPage={async page => {
                    await updateData(page + 1);
                  }}
                  previousPage={async page => {
                    await updateData(page - 1);
                  }}
                  onDelete={async (sales, page) => {
                    await deleteSales(sales, cookies.authorization.access_token);
                    await updateData(page);
                  }}
                  onRefresh={async (page) => {
                    await updateData(page);
                  }}
                />
            </div>
          )
        }}
      </Context.Consumer>
    );
}

  return(
    <Container>
      <NavBar />
      <Home />
    </Container>
  );
}

export default Seller;