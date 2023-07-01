import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Tabs,
  Tab,
  Grid,
  Stack,
  Rating,
  Button,
  Paper,
} from '@mui/material';
import { IconPencil } from '@tabler/icons-react';
import ChildCard from '../shared/ChildCard';
import ProfileCard from '../widgets/cards/ProfileCard';
import Tips from './Tips';
import { TaskQuery } from '@/graphql/generated/schema';

interface ProductCardProps {
  like: number;
  star: number;
  value?: number;
}

interface TabProps {
  children: React.ReactNode;
  index: number;
  value?: number;
}

// progress
function ProgressBar({ like, star, value, ...others }: ProductCardProps) {
  return (
    <Box display={'flex'} alignItems="center" gap="20px">
      <Box sx={{ minWidth: 50 }}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(star)} Stars`}</Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <LinearProgress value={value} variant="determinate" color="primary" {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="subtitle2">{`(${Math.round(like)})`}</Typography>
      </Box>
    </Box>
  );
}

const TabPanel = (props: TabProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const ProductDesc = ({task}:{
  task:TaskQuery|null|undefined
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ChildCard>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'grey.100' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="primary"
            allowScrollButtonsMobile
            scrollButtons
            indicatorColor="primary"
          >
            <Tab label="Prompts" {...a11yProps(0)} />
            <Tab label="Tips" {...a11yProps(1)} />
          </Tabs>
        </Box>
        {/* ------------------------------------------- */}
        {/* Decription */}
        {/* ------------------------------------------- */}
        <TabPanel value={value} index={0}>
        
        
          <Typography color="textSecondary" variant="h5" fontWeight={500} >
          Prompts
Copy a prompt, replace placeholders with relevant text, and paste it at ChatGPT for an efficient and streamlined experience.
          </Typography>
          <Grid container spacing={3} mt={1}>
          <Grid lg={12} md={12}  item xs={12}>
        <ProfileCard prompts= {task?.task?.prompts}/>
      </Grid>
</Grid>
          
        </TabPanel>
        {/* ------------------------------------------- */}
        {/* Reviews Tab */}
        {/* ------------------------------------------- */}
        <TabPanel value={value} index={1}>
        <Typography color="textSecondary" variant="h5" fontWeight={500} >
        Follow these guidelines to maximize your experience and unlock the full potential of your conversations with ChatGPT.


          </Typography>
          <Grid container spacing={3} mt={1}>
          <Grid lg={12} md={12}  item xs={12}>
        <Tips  tips={task?.task?.tips}/>
      </Grid> </Grid>
        </TabPanel>
      </Box>
    </ChildCard>
  );
};

export default ProductDesc;
