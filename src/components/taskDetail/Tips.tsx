import React from 'react';
import { CardContent, Typography, Grid, IconButton, Divider, Avatar, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';
import ReactMarkdown from 'react-markdown' 


import { CopyAll, Info } from '@mui/icons-material';
import BlankCard from '../shared/BlankCard';





const Tips = ({tips}: {tips:{
  __typename?: "Tip" | undefined;
  id: string;
  description: string;
}[] | undefined}
) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {tips?.map((tip, index) => (
        <Grid item xs={12} sm={12} key={index}>
          <BlankCard>
         

            <CardContent >
              <Stack direction={'column'} gap={2} >
                <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                <Info style={{
                    marginRight:10
                }}/>
                    <Typography>
                     {tip.description}
                    </Typography>
             
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

export default Tips;
