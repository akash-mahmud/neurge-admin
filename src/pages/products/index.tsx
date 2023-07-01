import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';


import FriendCard from '../../components/widgets/cards/FriendCard';



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


        <Grid item xs={12}>
          <FriendCard />
        </Grid>


      </Grid>
    </PageContainer>
  )
}
