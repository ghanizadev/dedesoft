import React, {useContext} from 'react';
import TableSales from '../components/tableSalesAdmin';
import NavBar from '../components/navbar';
import styled from 'styled-components';
import {useCookies} from 'react-cookie';
import {
  getSalesAll,
  deleteSales,
  paySales,
} from '../services'
import { Context } from '../context';
import { useHistory } from 'react-router-dom';

const Container = styled.div`
  padding: 90px 0 0 0;
  display: flex;
  flex: row;
  height: 100%;
`;

const Dashboard = props => {
  const [cookies, , removeCookies] = useCookies();
  const history = useHistory();

  const state = useContext(Context);

  const updateData = async (page) => {
    const sales = state.context.sales;

    const data = await getSalesAll(1, sales, cookies.authorization.access_token)
      .then(d => {return d})
      .catch(() => {
        removeCookies('authorization');
        history.push('/');
      })

    state.setContext({
      ...state.context,
      sales: {
        ...state.context.sales,
        data
      }
    })
  }

  React.useEffect(() => {
    updateData(1)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

  return(
    <Container>
      <NavBar/>
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
        onPay={async (sales, page) => {
          await paySales(sales, cookies.authorization.access_token);
          await updateData(page);
        }}
        onRefresh={async (page) => {
          await updateData(page);
        }}
        />
    </Container>
  );
}

export default Dashboard;