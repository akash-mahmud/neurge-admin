import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { persistor, useDispatch, useSelector } from '../../../../../store';
import { IconPower } from '@tabler/icons-react';
import { AppState } from '../../../../../store';
import Link from 'next/link';
import { logout } from '@/store/slices/auth/authSlice';
import { useRouter } from 'next/router';
import { getImage } from '@/utils/getimage';

export const Profile = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch()
  const router = useRouter()
  const {user} = useSelector((state ) => state.auth)
  
   const logoutUser = () => {
    dispatch(logout())
     router.push('/login')

  }
  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={`${user?.avater? getImage(user.avater): '/images/profile/user-1.jpg'}`} />

          <Box>
            <Typography variant="h6">
              {user?.name}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton onClick={logoutUser} type='button'
                color="primary"
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
