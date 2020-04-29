import React from 'react';
import TableSales from '../components/tableSalesAdmin';
import TableSellers from '../components/tableSellers';
import NavBar from '../components/navbar';
import styled from 'styled-components';
import {Context} from '../context';
import {useCookies} from 'react-cookie';
import {
  getSalesAll,
  deleteSales,
  paySales,
  getSellers,
  deleteSellers,
} from '../services'

const Container = styled.div`
  padding: 90px 0 0 0;
  display: flex;
  flex: row;
  height: 100%;
`;

const Dashboard = props => {
  const [page, setPage] = React.useState('sales');
  const [cookies, , removeCookies] = useCookies();
  const state = React.useContext(Context);

  const updateData = async (pageSellers, pageSales) => {
    const salesData = await getSalesAll(pageSales, cookies.authorization.access_token)
    .then(d => {
      return d;
    })
    .catch((e) => {
      window.alert(e.message);
      removeCookies('authorization');
      window.location.reload();
    })

    const sellersData = await getSellers(pageSellers, cookies.authorization.access_token)
    .then(d => {
      return d;
    })
    .catch((e) => {
      window.alert(e.message);
      console.log(e)
      removeCookies('authorization');
      window.location.reload();
    })

    state.setContext({
      ...state, 
      sales: {
        ...state.sales,
        data: salesData
      },
      sellers: {
        ...state.sellers,
        data: sellersData
      }
    });

  }

  React.useEffect(() => {
    updateData(1, 1);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

  const Sellers = () => <TableSellers
    nextPage={async page => {
        await updateData(page + 1, 1);
    }}
    previousPage={async page => {
        await updateData(page - 1, 1);
    }}
    onDelete={async (sales, page) => {
        await deleteSellers(sales, cookies.authorization.access_token);
        await updateData(page, 1);
    }}
    onRefresh={async (page)=> {
      await updateData(page, 1);
    }}
    />

const Sales = () => 
    <TableSales
        nextPage={async page => {
          await updateData(1, page + 1);
        }}
        previousPage={async page => {
          await updateData(1, page - 1);
        }}
        onDelete={async (sales, page) => {
          await deleteSales(sales, cookies.authorization.access_token);
          await updateData(1, page);
        }}
        onPay={async (sales, page) => {
          await paySales(sales, cookies.authorization.access_token);
          await updateData(1, page);
        }}
        onRefresh={async (page) => {
          await updateData(1, page);
        }}
        />

  const getPage = () => {
    switch(page){
      case 'sales': return <Sales />
      case 'sellers': return <Sellers />
      default: return <Sales />
    }
  }

  return(
    <Container>
      <NavBar
        items={[
          {name: "Vendas", path: 'sales'},
          {name: "Vendedores", path: 'sellers'},
        ]}
        onChange={(p) => {
          setPage(p);
        }}
      />
      {getPage()}
    </Container>
  );
}

export default Dashboard;