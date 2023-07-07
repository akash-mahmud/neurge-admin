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
import { Button, Input, Modal, Pagination, Popconfirm, Popover, Upload } from 'antd';
import slugify from 'slugify'
import PageContainer from '../../../src/components/container/PageContainer';
import { default as emojiData } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ParentCard from '../../../src/components/shared/ParentCard';
import BlankCard from '../../../src/components/shared/BlankCard';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { AddonCreateInput, AddonUpdateInput, useAggregateAddonQuery, useDeleteOneAddonMutation, useAddonForupdateLazyQuery, SortOrder, useAddonsForTableViewQuery, useUpdateOneAddonMutation, useAggregateProductQuery, useCategoriesWithoutRelationFieldQuery, useCategoryDataForUpdateLazyQuery, useCreateOneCategoryMutation, useCreateOneProductMutation, useDeleteOneCategoryMutation, useDeleteOneProductMutation, useLoadProductForUpdateLazyQuery, useProductsForTableViewQuery, useUpdateOneCategoryMutation, useUpdateOneProductMutation } from '@/graphql/generated/schema';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useState } from 'react';

const columns = [
  { id: 'pname', label: 'Name', minWidth: 170 },
  { id: 'image', label: 'image', minWidth: 100 },

  {
    id: 'addonBlogCategory',
    label: 'addonBlogCategory',
    minWidth: 170,
  },
  {
    id: 'blog',
    label: 'blog',
    minWidth: 170,
  },
  {
    id: 'purchasedByUsers',
    label: 'purchasedByUsers',
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
import { useCreateOneAddonMutation } from '@/graphql/generated/schema';
import { EmojiEmotions } from '@mui/icons-material';

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
  const { data, loading, error, refetch } = useAddonsForTableViewQuery({
    variables: {
      take: limit,
      skip: skip * limit,
      orderBy: [{
        updatedAt: SortOrder.Desc
      }]
    }
  })
  const { data: total, refetch: refetchTotal } = useAggregateAddonQuery()
  const [open, setOpen] = useState(false);
  const [input, setinput] = useState<AddonUpdateInput>({
  })
  const [createInput, setcreateInput] = useState<AddonCreateInput>({
    name: '',
    description: '',
    img: '',
    imoji:'',
    purchaseUrl:''

  })
  const [LoadAddon,] = useAddonForupdateLazyQuery({ fetchPolicy: 'network-only' })
  const { data: categories } = useCategoriesWithoutRelationFieldQuery()
  const [productId, setproductId] = useState<string>()
  const handleClickOpen = async (id?: string) => {
    if (id) {
      const { data } = await LoadAddon({
        variables: {

          where: {
            id: id
          }
        }
      })
      setproductId(id)
      if (data?.addon) {
        setinput({
          name: {
            set: data.addon.name 
          },

          description: {
            set: data.addon.description 
          },
          img: {
            set: data.addon.img 
          },
          purchaseUrl: {
            set: data.addon.purchaseUrl 
          },
         
        imoji: {
          set: data.addon.imoji
        }
        })


      }
      setPreviewImage(data?.addon?.img  as string)
      setFileList([data?.addon?.img ])
    }

    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
    setproductId(undefined)
  };
  const [UpdateAddon] = useUpdateOneAddonMutation()
  const [CreteAddon] = useCreateOneAddonMutation()
  const [DeleteAddon] = useDeleteOneAddonMutation()
  const deleteData = async (productId: string) => {
    await DeleteAddon({
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
    await UpdateAddon({
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
      await CreteAddon({
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
                    <TextField

                      onChange={(event) => {
                        setinput({
                          ...input,
                          imoji: {
                            set:event.target.value 
                          }
                        })
                      }}
                      value={input?.imoji?.set}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start" style={{
                            cursor: 'pointer'

                          }}
                          >
                            <Popover overlayClassName='imojiPophover' placement="right" zIndex={9999999999999} content={
                              <Picker data={emojiData} onEmojiSelect={(data: {
                                id: string,
                                keywords: string[]
                                name
                                : string
                                native
                                : string
                                shortcodes
                                : string
                                unified: string
                              }) => {
                                setinput({
                                  ...input,
                                  imoji: {
                                    set:data.native
                                  }
                                })

                              }} />

                            } trigger="click">
                              <EmojiEmotions />
                            </Popover>
                          </InputAdornment>
                        ),

                      }}
                      placeholder="Imoji"
                      fullWidth

                    />
                  </Box>

               <Box flexBasis={'calc(33.33% - 10px)'}>
                 <CustomTextField value={input?.purchaseUrl?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                   setinput({
                     ...input,
                     purchaseUrl: {
                      set:e.target.value
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
                    <TextField

                      onChange={(event) => {
                        setcreateInput({
                          ...createInput,
                          imoji:event.target.value
                        })
                      }}
                      value={createInput.imoji}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start" style={{
                            cursor: 'pointer'

                          }}
                          >
                            <Popover overlayClassName='imojiPophover' placement="right" zIndex={9999999999999} content={
                              <Picker data={emojiData} onEmojiSelect={(data: {
                                id: string,
                                keywords: string[]
                                name
                                : string
                                native
                                : string
                                shortcodes
                                : string
                                unified: string
                              }) => {
                                setcreateInput({
                                  ...createInput,
                                  imoji: data.native
                                })

                              }} />

                            } trigger="click">
                              <EmojiEmotions />
                            </Popover>
                          </InputAdornment>
                        ),

                      }}
                      placeholder="Imoji"
                      fullWidth

                    />
                  </Box>
                <Box flexBasis={'calc(33.33% - 10px)'}>
                  <CustomTextField value={createInput?.purchaseUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setcreateInput({
                      ...createInput,
                      purchaseUrl: e.target.value
                    })
                  }} style={{
                    margin: '10px'
                  }}
                    autoFocus
                    id="name"
                    label="Purchase url"
                    type="url"
                    fullWidth
                  />
                </Box>
              




              </Box>
                <Box display={'flex'} m={2} flexDirection={'column'}>

                  <Box>

                    <Input.TextArea spellCheck={false} value={createInput?.description as string} onChange={(e) => {
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
                    {data?.addons.map((addon) => {
                      return (
                        <TableRow hover key={addon.id}>
                          <TableCell>
                          {addon.imoji}  {addon.name}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2" fontWeight="500">
                              <Avatar src={addon.img} />
                            </Typography>


                          </TableCell>
                         
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {addon._count?.addonBlogCategory}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {addon._count?.blog}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {addon._count?.purchasedByUsers}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Popconfirm onConfirm={() => deleteData(addon.id)} title="Are you sure?">

                              <IconButton>
                                <IconTrash width={18} />
                              </IconButton>
                            </Popconfirm>
                            <IconButton onClick={() => handleClickOpen(addon.id)}>
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

                }} total={total?.aggregateAddon._count?._all} pageSize={limit} />
              </Box>

            </BlankCard>
          </>

        </ParentCard>
      </PageContainer>
    </>

  );
};

export default Index;
