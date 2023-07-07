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
  InputAdornment,
  Avatar,
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from '@mui/material';
import { Button, Input, Modal, Pagination, Popconfirm, Upload } from 'antd';
import slugify from 'slugify'
import PageContainer from '../../../src/components/container/PageContainer';

import ParentCard from '../../../src/components/shared/ParentCard';
import BlankCard from '../../../src/components/shared/BlankCard';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { CategoryCreateInput, CategoryUpdateInput, ProductCreateInput, ProductUpdateInput, SortOrder, useAggregateCategoryQuery, useAggregateProductQuery, useCategoriesWithoutRelationFieldQuery, useCategoryDataForUpdateLazyQuery, useCreateOneCategoryMutation, useCreateOneProductMutation, useDeleteOneCategoryMutation, useDeleteOneProductMutation, useLoadProductForUpdateLazyQuery, useProductsForTableViewQuery, useUpdateOneCategoryMutation, useUpdateOneProductMutation } from '@/graphql/generated/schema';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useState } from 'react';

const columns = [
  { id: 'pname', label: 'Name', minWidth: 170 },
  { id: 'image', label: 'image', minWidth: 100 },
  {
    id: 'category',
    label: 'category',
    minWidth: 170,
  },
  {
    id: 'moneyBackGuarantee',
    label: 'moneyBackGuarantee',
    minWidth: 170,
  },
  {
    id: 'taskAutomateCount',
    label: 'taskAutomateCount',
    minWidth: 170,
  },
  {
    id: 'topTierPromptCount',
    label: 'topTierPromptCount',
    minWidth: 170,
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
  },
];


import { PlusOutlined } from '@ant-design/icons';

import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile, UploadProps } from 'antd/es/upload';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Index = () => {
  const [limit, setlimit] = useState(5)
  const [skip, setskip] = useState(0)
  const [order, setorder] = useState()
  const { data, loading, error, refetch } = useProductsForTableViewQuery({
    variables: {
      take: limit,
      skip: skip * limit,
      orderBy: [{
        updatedAt: SortOrder.Desc
      }]
    }
  })
  const { data: total, refetch: refetchTotal } = useAggregateProductQuery()
  const [open, setOpen] = useState(false);
  const [input, setinput] = useState<ProductUpdateInput>({
  })
  const [createInput, setcreateInput] = useState<ProductCreateInput>({
    name: '',
    description: '',
    image: '',
    category: {
      connect: {
        id: ''
      }
    },
    moneyBackGuarantee: 0,
    taskAutomateCount: 0,
    topTierPromptCount: 0,
    slug: ''
  })
  const [LoadProduct,] = useLoadProductForUpdateLazyQuery({ fetchPolicy: 'network-only' })
  const { data: categories } = useCategoriesWithoutRelationFieldQuery()
  const [productId, setproductId] = useState<string>()
  const handleClickOpen = async (id?: string) => {
    if (id) {
      const { data } = await LoadProduct({
        variables: {

          where: {
            id: id
          }
        }
      })
      setproductId(id)
      if (data?.product) {
        setinput({
          name: {
            set: data.product.name 
          },

          description: {
            set: data.product.description 
          },
          image: {
            set: data.product.image 
          },
          moneyBackGuarantee: {
            set: data.product.moneyBackGuarantee 
          },
          topTierPromptCount: {
            set: data.product.topTierPromptCount 
          },
          taskAutomateCount: {
            set: data.product.taskAutomateCount 
          },

          slug: {
            set: data.product.slug 
          },
          category: {
            connect:{
              id:data.product.categoryId
            }
          }
        })


      }
      setPreviewImage(data?.product?.image as string)
      setPreviewImage(data?.product?.image as string)
      setFileList([data?.product?.image])
    }

    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
    setproductId(undefined)
  };
  const [UpdateProduct] = useUpdateOneProductMutation()
  const [CreateProduct] = useCreateOneProductMutation()
  const [DeleteProduct] = useDeleteOneProductMutation()
  const deleteData = async (productId: string) => {
    await DeleteProduct({
      variables: {
        where: {
          id: productId
        }
      }
    })
    await refetchTotal()
    await refetch()
  }
  const update = async () => {
    await UpdateProduct({
      variables: {
        data: input,
        where: {
          id: productId
        }
      }
    })
    handleClose()
    await refetchTotal()
    await refetch()

  }

  const create = async () => {
    if (createInput) {
      await CreateProduct({
        variables: {
          data: createInput,

        }
      })
      handleClose()
      await refetchTotal()

      await refetch()
    }

  }
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<any[]>([])
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj as RcFile);
    // }
// file.url =''
    setPreviewImage(file.url as string);
    setPreviewOpen(true);
    // setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <Box>
      <PlusOutlined rev={undefined} />
      <div style={{ marginTop: 8 }}>Upload</div>
    </Box>
  );
  return (
    <>
      <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'} style={{
          zIndex: 1
        }} hideBackdrop disableEnforceFocus>
          <DialogTitle>{productId ? 'Update' : 'Create'} Category</DialogTitle>
          <DialogContent>
            {
              productId ?   <> 
              <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexWrap={"wrap"}>
               <Box flexBasis={'calc(33.33% - 10px)'}>
                 <CustomTextField value={input?.name?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                   setinput({
                     ...input,
                     name: {
                      set:e.target.value
                     },
                     slug: {
                      set: slugify(e.target.value, { lower: true })
                     }
                   })
                 }} style={{
                   margin: '10px'
                 }}
                   autoFocus
                   id="name"
                   label="Name"
                   type="text"
                   fullWidth
                 />
               </Box>
               <Box flexBasis={'calc(33.33% - 10px)'}>
                 <CustomTextField value={input?.slug?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                   setinput({
                     ...input,
                     slug: {
                      set:slugify(e.target.value, { lower: true })
                     }
                   })
                 }} style={{
                   margin: '10px'
                 }}
                   autoFocus
                   id="name"
                   label="Slug"
                   type="text"
                   fullWidth
                 />
               </Box>
               <Box flexBasis={'calc(33.33% - 10px)'}>
                 <FormControl style={{
                   margin: '10px'
                 }} fullWidth>
                   <InputLabel id="demo-simple-select-label">Category</InputLabel>
                   <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={input.category?.connect?.id}
                     label="Category"
                     onChange={(event) => {
                       setinput({
                         ...input,
                         category: {
                           connect: {
                             id: event.target.value
                           }
                         }
                       })
                     }}
                   >
                     {
                       categories?.categories?.map((category) => (
                         <MenuItem value={category.id}>{category.name}</MenuItem>
                       ))
                     }

                   </Select>
                 </FormControl>
               </Box>
               <Box flexBasis={'calc(33.33% - 10px)'}>
                 <CustomTextField value={input?.moneyBackGuarantee?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                   setinput({
                     ...input,
                     moneyBackGuarantee: {
                      set:parseInt(e.target.value)
                     }
                   })
                 }} style={{
                   margin: '10px'
                 }}
                   autoFocus
                   id="name"
                   label="moneyBackGuarantee"
                   type="number"
                   fullWidth
                 />
               </Box>
               <Box flexBasis={'calc(33.33% - 10px)'}>
                 <CustomTextField value={input?.taskAutomateCount?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                   setinput({
                     ...input,
                     taskAutomateCount: {
                      set:parseInt(e.target.value)
                     }
                   })
                 }} style={{
                   margin: '10px'
                 }}
                   autoFocus
                   id="name"
                   label="taskAutomateCount"
                   type="number"
                   fullWidth
                 />
               </Box>
               <Box flexBasis={'calc(33.33% - 10px)'}>
                 <CustomTextField value={input?.topTierPromptCount?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                   setinput({
                     ...input,
                     topTierPromptCount: {
                      set:parseInt(e.target.value)
                     }
                   })
                 }} style={{
                   margin: '10px'
                 }}
                   autoFocus
                   id="name"
                   label="topTierPromptCount"
                   type="number"
                   fullWidth
                 />
               </Box>




             </Box>
               <Box display={'flex'} m={2} flexDirection={'column'}>

                 <Box>

                   <Input.TextArea spellCheck={false} value={input?.description?.set as string} onChange={(e) => {
                     setinput({
                       ...input,
                       description: {
                        set:e.target.value
                       }
                     })
                   }} style={{
                     height: 200
                   }}
                     autoFocus
                     id="name"
                     placeholder="Description"


                   />
                 </Box>
                 <Box mt={2}>

                   <Upload multiple={false} maxCount={1}
                     action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                     listType="picture-card"
                    //  fileList={fileList}
                    fileList={fileList.map((url, index) => ({
                      uid: index.toString(),
                      name: `image-${index}`,
                      status: 'done',
                      url: url,
                    }))}
                     onPreview={handlePreview}
                     onChange={handleChange}
                   >
                     {fileList.length >= 8 ? null : uploadButton}
                   </Upload>
                 </Box>
                 <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                   <img alt="example" style={{ width: '100%' }} src={previewImage} />
                 </Modal>
               </Box>
             </> :
               <> 
               <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexWrap={"wrap"}>
                <Box flexBasis={'calc(33.33% - 10px)'}>
                  <CustomTextField value={createInput?.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setcreateInput({
                      ...createInput,
                      name: e.target.value,
                      slug: slugify(e.target.value, { lower: true })
                    })
                  }} style={{
                    margin: '10px'
                  }}
                    autoFocus
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                  />
                </Box>
                <Box flexBasis={'calc(33.33% - 10px)'}>
                  <CustomTextField value={createInput?.slug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setcreateInput({
                      ...createInput,
                      slug: slugify(e.target.value, { lower: true })
                    })
                  }} style={{
                    margin: '10px'
                  }}
                    autoFocus
                    id="name"
                    label="Slug"
                    type="text"
                    fullWidth
                  />
                </Box>
                <Box flexBasis={'calc(33.33% - 10px)'}>
                  <FormControl style={{
                    margin: '10px'
                  }} fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={createInput.category?.connect?.id}
                      label="Category"
                      onChange={(event) => {
                        setcreateInput({
                          ...createInput,
                          category: {
                            connect: {
                              id: event.target.value
                            }
                          }
                        })
                      }}
                    >
                      {
                        categories?.categories?.map((category) => (
                          <MenuItem value={category.id}>{category.name}</MenuItem>
                        ))
                      }

                    </Select>
                  </FormControl>
                </Box>
                <Box flexBasis={'calc(33.33% - 10px)'}>
                  <CustomTextField value={createInput?.moneyBackGuarantee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setcreateInput({
                      ...createInput,
                      moneyBackGuarantee: parseInt(e.target.value)
                    })
                  }} style={{
                    margin: '10px'
                  }}
                    autoFocus
                    id="name"
                    label="moneyBackGuarantee"
                    type="number"
                    fullWidth
                  />
                </Box>
                <Box flexBasis={'calc(33.33% - 10px)'}>
                  <CustomTextField value={createInput?.taskAutomateCount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setcreateInput({
                      ...createInput,
                      taskAutomateCount: parseInt(e.target.value)
                    })
                  }} style={{
                    margin: '10px'
                  }}
                    autoFocus
                    id="name"
                    label="taskAutomateCount"
                    type="number"
                    fullWidth
                  />
                </Box>
                <Box flexBasis={'calc(33.33% - 10px)'}>
                  <CustomTextField value={createInput?.topTierPromptCount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setcreateInput({
                      ...createInput,
                      topTierPromptCount: parseInt(e.target.value)
                    })
                  }} style={{
                    margin: '10px'
                  }}
                    autoFocus
                    id="name"
                    label="topTierPromptCount"
                    type="number"
                    fullWidth
                  />
                </Box>




              </Box>
                <Box display={'flex'} m={2} flexDirection={'column'}>

                  <Box>

                    <Input.TextArea spellCheck={false} value={createInput?.description} onChange={(e) => {
                      setcreateInput({
                        ...createInput,
                        description: e.target.value
                      })
                    }} style={{
                      height: 200
                    }}
                      autoFocus
                      id="name"
                      placeholder="Description"


                    />
                  </Box>
                  <Box mt={2}>

                    <Upload multiple={false} maxCount={1}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                  </Box>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Box>
              </>

            }

          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>Cancel</Button>
            <Button onClick={productId ? update : create}>{productId ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </Dialog>
      </Grid>

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
                    {data?.products.map((product) => {
                      return (
                        <TableRow hover key={product.id}>
                          <TableCell>
                            {product.name}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2" fontWeight="500">
                              <Avatar src={product.image} />
                            </Typography>


                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {product.category?.name}

                            </Typography>

                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {product.moneyBackGuarantee}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {product.taskAutomateCount}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {product.topTierPromptCount}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Popconfirm onConfirm={() => deleteData(product.id)} title="Are you sure?">

                              <IconButton>
                                <IconTrash width={18} />
                              </IconButton>
                            </Popconfirm>
                            <IconButton onClick={() => handleClickOpen(product.id)}>
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

                }} total={total?.aggregateProduct._count?._all} pageSize={limit} />
              </Box>

            </BlankCard>
          </>

        </ParentCard>
      </PageContainer>
    </>

  );
};

export default Index;
