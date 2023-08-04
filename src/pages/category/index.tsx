import {
  Typography,
  Box,

  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import { Button, ColorPicker, Pagination, Popconfirm, Spin } from 'antd';

import PageContainer from '../../../src/components/container/PageContainer';

import ParentCard from '../../../src/components/shared/ParentCard';
import BlankCard from '../../../src/components/shared/BlankCard';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { CategoryCreateInput, CategoryUpdateInput, SortOrder, useAggregateCategoryQuery, useCategoriesWithoutRelationFieldQuery, useCategoryDataForUpdateLazyQuery, useCreateOneCategoryMutation, useDeleteOneCategoryMutation, useUpdateOneCategoryMutation } from '@/graphql/generated/schema';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useState } from 'react';

const columns = [
  { id: 'pname', label: 'Name', minWidth: 170 },
  { id: 'products', label: 'products', minWidth: 100 },
  {
    id: 'purchasedByUsers',
    label: 'Purchased By Users',
    minWidth: 170,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    minWidth: 170,
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
  },
];





const Index = () => {
  const [limit, setlimit] = useState(5)
  const [skip, setskip] = useState(0)
  const [order, setorder] = useState()
  const { data, loading, error, refetch } = useCategoriesWithoutRelationFieldQuery({
    variables: {
      take: limit,
      skip: skip * limit,
      orderBy: [{
        updatedAt: SortOrder.Desc
      }]
    }
  })
  const { data: total, refetch: refetchTotal , loading:aggregaeateLoading} = useAggregateCategoryQuery()
  const [open, setOpen] = useState(false);
  const [input, setinput] = useState<CategoryUpdateInput>({
  })
  const [createInput, setcreateInput] = useState<CategoryCreateInput>()
  const [LoadCategory,{loading:categoryDartaLoading}] = useCategoryDataForUpdateLazyQuery()
  const [categoryId, setcategoryId] = useState<string>()
  const handleClickOpen = async (id?: string) => {
    if (id) {
      const { data } = await LoadCategory({
        variables: {

          where: {
            id: id
          }
        }
      })
      setcategoryId(id)
      if (data?.category) {
        setinput({
          name: {
            set: data.category.name as string
          },
          colour:{
            set: data.category.colour as string
          }

        })


      }
    }


    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
    setcategoryId(undefined)
  };
  const [UpdateCategory, {loading:updateCategoryLoading}] = useUpdateOneCategoryMutation()
  const [CreateCategory , {loading:createCategoryLoading}] = useCreateOneCategoryMutation()
  const [DeleteCategory , {loading:deleteCategortLoading}] = useDeleteOneCategoryMutation()
  const deleteData = async (categoryId: string) => {
    await DeleteCategory({
      variables: {
        where: {
          id: categoryId
        }
      }
    })
    await refetchTotal()
    await refetch()
  }
  const update = async () => {
    await UpdateCategory({
      variables: {
        data: input,
        where: {
          id: categoryId
        }
      }
    })
    handleClose()
    await refetchTotal()
    await refetch()

  }

  const create = async () => {
    if (createInput) {
      await CreateCategory({
        variables: {
          data: createInput,

        }
      })
      handleClose()
      await refetchTotal()

      await refetch()
    }

  }
  return (
    <>
      <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'} >
          <DialogTitle>{categoryId ? 'Update' : 'Create'} Category</DialogTitle>
          <DialogContent>
            {
              categoryId ?<Spin spinning={updateCategoryLoading}><Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>

              <CustomTextField value={input.name?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setinput({
                  name: {
                    set: e.target.value
                  }
                })
              }} style={{
                margin: '10px'
              }}
                autoFocus
                id="name"
                label="Category Name"
                type="text"
                fullWidth
              />
      <ColorPicker format='hex' value={input?.colour?.set as string}  allowClear onChange={(colour) => setinput((previousState) => {
        
        return{...previousState , colour:{
        set:`#${colour.toHex()}`
      }}})} />

            </Box> </Spin> 
              : <Spin spinning={createCategoryLoading}>

              <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>

                <CustomTextField value={createInput?.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setcreateInput({
                    name: e.target.value
                  })
                }} style={{
                  margin: '10px'
                }}
                  autoFocus
                  id="name"
                  label="Category Name"
                  type="text"
                  fullWidth
                />
                <Box width={'60px'}>

      <ColorPicker value={createInput?.colour as string}  allowClear onChange={(colour) => setcreateInput((previousState) => {return{...previousState , colour:`#${colour.toHex()}`}})} />
                </Box>

              </Box>
              </Spin>
            }

          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>Cancel</Button>
            <Button onClick={categoryId ? update : create}>{categoryId ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </Dialog>
      </Grid>
<Spin spinning={loading || aggregaeateLoading || categoryDartaLoading || deleteCategortLoading}>

      <PageContainer>

        <ParentCard title="">
          <>
            <Box mb={3} display={'flex'} justifyContent={'space-between'}>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start" style={{
                      cursor: 'pointer'

                    }}>
                      <IconSearch size="1.1rem" />
                    </InputAdornment>
                  ),

                }}
                placeholder="Search Categoy"
                size="small"
              // onChange={handleSearch}
              // value={search}
              />
              <Button onClick={() => handleClickOpen()}>
                Add
              </Button>
            </Box>
            <BlankCard>

              <TableContainer
                sx={{
                  maxHeight: 440,
                }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          <Typography variant="h6" fontWeight="500">
                            {column.label}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.categories.map((category) => {
                      return (
                        <TableRow hover key={category.id}>
                          <TableCell>
                            {category.name}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2" fontWeight="500">
                              {category._count?.products}
                            </Typography>


                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {category._count?.purchasedByUsers}

                            </Typography>

                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {category._count?.tasks}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Popconfirm onConfirm={() => deleteData(category.id)} title="Are you sure?">

                              <IconButton>
                                <IconTrash width={18} />
                              </IconButton>
                            </Popconfirm>
                            <IconButton onClick={() => handleClickOpen(category.id)}>
                              <IconEdit width={18} />
                            </IconButton>



                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>

                </Table>
              </TableContainer>
              <Box pb={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>

                <Pagination current={skip + 1} onChange={(pageNumber) => {
                  setskip(pageNumber - 1)

                }} total={total?.aggregateCategory._count?._all} pageSize={limit} />
              </Box>

            </BlankCard>
          </>

        </ParentCard>
      </PageContainer>
</Spin>
    </>

  );
};

export default Index;
