import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';

import PaymentGateways from '../../components/dashboards/ecommerce/PaymentGateways';



const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Cards',
  },
];
export default function index() {
  return (
    <PageContainer>

      <Grid container spacing={3}>



        <Grid item xs={12} sm={6} lg={4}>
          <PaymentGateways />
        </Grid>


      </Grid>
    </PageContainer>)
}
