import React, { useEffect, useRef } from "react";
import { Box, Button, Grid } from "@mui/material";
import { Favorite, Link } from "@mui/icons-material";


const SideSection = () => {

  

  return (
<Grid container spacing={3} >
<Grid item xs={3}  sm={4} lg={3} >
  <Button><Link/></Button>
</Grid>
<Grid item xs={3} sm={4} lg={3} >
  <Button><Favorite/></Button>
</Grid>
</Grid>
  );
};

export default SideSection;
