import React from 'react';
import TableSales from '../components/tableSalesAdmin';
import NavBar from '../components/navbar';
import styled from 'styled-components';
import {useCookies} from 'react-cookie';
import {
  getSalesAll,
  deleteSales,
  paySales,
  getSellers,
} from '../services'

const Container = styled.div`
  padding: 90px 0 0 0;
  display: flex;
  flex: row;
  height: 100%;
`;

const Dashboard = props => {
  const [sales, setSales] = React.useState({docs:[]});
  const [sellers, setSellers] = React.useState({docs:[]});
  const [cookies, , removeCookies] = useCookies();

  React.useEffect(() => {
    const run = async () => {
      await getSalesAll(1, cookies.authorization.access_token)
      .then(d => setSales(d))
      .catch(() => {
        removeCookies('authorization');
        window.location.reload();
      })

      await getSellers(1, cookies.authorization.access_token)
      .then(d => setSellers(d))
      .catch(() => {
        removeCookies('authorization');
        window.location.reload();
      })
    }

    run();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

const Sales = () => 
    <TableSales
        data={sales}
        nextPage={async page => {
        const d = await getSalesAll(page + 1, cookies.authorization.access_token);
        setSales(d);
        }}
        previousPage={async page => {
        const d = await getSalesAll(page - 1, cookies.authorization.access_token);
        setSales(d);
        }}
        onDelete={async (sales, page) => {
        await deleteSales(sales, cookies.authorization.access_token);

        const d = await getSalesAll(page);
        setSales(d);

        }}
        onPay={async (sales, page) => {
        await paySales(sales, cookies.authorization.access_token);
        const d = await getSalesAll(page, cookies.authorization.access_token);
        setSales(d);

        }}
        onRefresh={async (page) => {
            const d = await getSellers(sellers.currentPage, cookies.authorization.access_token);
            setSellers(d);

        }}
        />

  return(
    <Container>
      <NavBar/>
      <Sales />
    </Container>
  );
}

export default Dashboard;