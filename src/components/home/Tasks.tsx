import Image from "next/image";
import { Box, CardContent, Chip, Grid, Typography } from "@mui/material";

import icon2 from "public/images/svgs/icon-user-male.svg";

import Link from "next/link";
import {  useTasksWithoutrelationalDataQuery } from "@/graphql/generated/schema";
import { useRouter } from "next/router";

export const topcards = [
  {
    icon: icon2,
    imoji: '🙂',
    title: "In this prompt you will learn how to use chatgpt",
    digits: "96",
    bgcolor: "primary",
    tags:['ai', 'marketing', 'chatgpt' ]
  },

  {
    icon: icon2,
    imoji: '🙂',
    title: "In this prompt you will learn how to use chatgpt",
    digits: "96",
    bgcolor: "primary",
    tags:['ai', 'marketing', 'chatgpt' ]
  },
  {
    icon: icon2,
    imoji: '🙂',
    title: "In this prompt you will learn how to use chatgpt",
    digits: "96",
    bgcolor: "primary",
    tags:['ai', 'marketing', 'chatgpt' ]
  },
  {
    icon: icon2,
    imoji: '🙂',
    title: "In this prompt you will learn how to use chatgpt",
    digits: "96",
    bgcolor: "primary",
    tags:['ai', 'marketing', 'chatgpt' ]
  },
];

const Tasks = () => {
  const router = useRouter()

  const {data:tasks , loading}  = useTasksWithoutrelationalDataQuery({
    variables:{
      where:{
        categoryId:{
          equals:router.query.category as string
        }
      }
    }
  })
  return (
    <Grid container spacing={3} >
      {tasks?.tasks?.map((task, i) => (
        <Grid item xs={12} sm={4} lg={3} key={i}>
          <Link href={`/task/${task.id}`}>
          <Box 
          bgcolor={
            'primary' + ".light"} 
          
          textAlign="center">
            <CardContent>
              {/* <Image src={topcard.icon} alt={"topcard.icon"} width="50" /> */}
              {/* <Typography
                color={topcard.bgcolor + ".main"}
                mt={1}
                variant="h1"
                fontWeight={600}
              >
                {topcard.imoji}
              </Typography> */}
              <Typography align="left"
                // color={topcard.bgcolor + ".main"}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
               {task.imoji} {task.name}
              </Typography>
              <Grid display={'flex'} style={{
                margin:5
              }} justifyContent={'flex-start'} item xs={12} sm={12} lg={12} key={i}>
              {
                task.tags.map((tag)=> (
                    
                  <Chip style={{
                    marginRight:5
                  }}
                  variant={ "filled"}
                  size="small"
                  label={tag}
                  />
                  ))
                }
                </Grid>
              
            </CardContent>
          </Box>
          </Link>
          
        </Grid>
      ))}
    </Grid>
  );
};

export default Tasks;
