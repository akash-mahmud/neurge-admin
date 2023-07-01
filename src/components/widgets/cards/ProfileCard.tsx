import React from 'react';
import { CardContent, Typography, Grid, IconButton, Divider, Avatar, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';
import ReactMarkdown from 'react-markdown' 

import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitter,
} from '@tabler/icons-react';
import BlankCard from '../../shared/BlankCard';
import { CopyAll } from '@mui/icons-material';
import { Prompt } from '@/graphql/generated/schema';

const SocialIcons = [
  {
    name: 'Facebook',
    icon: <IconBrandFacebook size="18" color="#1877F2" />,
  },
  {
    name: 'Instagram',
    icon: <IconBrandInstagram size="18" color="#D7336D" />,
  },
  {
    name: 'Github',
    icon: <IconBrandGithub size="18" color="#006097" />,
  },
  {
    name: 'Twitter',
    icon: <IconBrandTwitter size="18" color="#1C9CEA" />,
  },
];

const profileCard = [
  {
    name: 'Andrew Grant',
    role: 'Technology Director',
    avatar: "/images/profile/user-1.jpg",
  },
  {
    name: 'Leo Pratt',
    role: 'Telecom Analyst',
    avatar: "/images/profile/user-2.jpg",
  },
  {
    name: 'Charles Nunez',
    role: 'Environmental Specialist',
    avatar: "/images/profile/user-3.jpg",
  },
];

const ProfileCard = ({prompts}:{
  prompts:{ __typename?: "Prompt" | undefined; description: string; id: string; name: string; }[]| undefined|null
}) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {prompts?.map((prompt, index) => (
        <Grid item xs={12} sm={12} key={index}>
          <BlankCard>
          <Box
              p={2}
              py={1}
              textAlign={'center'}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.05)' : '#1d2939',
                borderEndStartRadius:0,
                borderEndEndRadius:0
              }}
            >
             <Grid container flexDirection={'row'} justifyContent={'space-between'} alignContent={'center'}>
<Grid item >
<Typography variant="h5" color={"#fff"}>{prompt.name}</Typography>

</Grid>
<Grid item><Button><CopyAll/> Copy</Button></Grid>
             </Grid>
            </Box>

            <CardContent sx={{
              backgroundColor:'#111828'
            }}>
              <Stack direction={'column'} gap={2} >
                <Box  color={'#fff'}>
                <ReactMarkdown>{prompt.description}</ReactMarkdown>
                </Box>
              </Stack>
            </CardContent>
            <Divider />
         
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileCard;
