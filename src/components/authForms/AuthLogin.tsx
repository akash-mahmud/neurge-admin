import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "../../../src/types/auth/auth";

import { Spin, notification } from 'antd';

import { useState } from "react";
import { LoginAdminMutationVariables } from "@/graphql/generated/schema";
import { useDispatch, useSelector } from "@/store";
import { login } from "@/store/slices/auth/authSlice";
import { useRouter } from "next/router";
import CustomCheckbox from "../forms/theme-elements/CustomCheckbox";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../forms/theme-elements/CustomTextField";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [input, setinput] = useState<LoginAdminMutationVariables>({
    email: '',
    password: ''
  }) 
  const dispatch = useDispatch()
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinput({
      ...input, [e.target.name]: e.target.value
    })
  }
  const [loading, setloading] = useState(false)
  const { isAuthenticated, error, isError, user } = useSelector((store) => store.auth)
  const router = useRouter()
  const onSubmit = async () => {
    setloading(true)
    try {
      const result = await dispatch(login(input))
      console.log(result);
      // @ts-ignore
      if(result?.payload?.loginAdmin?.isAuthenticated){
        notification.success({
          message: 'Logged in'
        })
        router.push('/')
      }else{
        console.log(result.payload);
        
notification.error({
  message:result.payload as string
})
      }
 

    } catch (error: any) {
      
      notification.error({
        message: error.message
      })
    }

    setloading(false)

  }
  return (
    <>
      <Spin spinning={loading}>

        {title ? (
          <Typography fontWeight="700" variant="h3" mb={1}>
            {title}
          </Typography>
        ) : null}

        {subtext}


        <Box mt={3}>
          <Divider>

          </Divider>
        </Box>

        <Stack>
          <Box>
            <CustomFormLabel htmlFor="username">email</CustomFormLabel>
            <CustomTextField name="email" id="username" variant="outlined" autoComplete={'off'} fullWidth onChange={onChange} />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField autoComplete={'new-password'} onChange={onChange}
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              name="password"
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remeber this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button onClick={onSubmit}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="button"
          >
            Sign In
          </Button>
        </Box>
        {/* {subtitle} */}
      </Spin>

    </>
  )
};

export default AuthLogin;
