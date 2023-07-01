import PageContainer from "@/components/container/PageContainer";
import ProductTableList from "@/components/ecommerce/ProductTableList/ProductTableList";
import { Box } from "@mui/material";

const Index = () => {

  return (
<PageContainer>

<Box>
  <ProductTableList />
</Box>
</PageContainer>
  );
};

export default Index;
