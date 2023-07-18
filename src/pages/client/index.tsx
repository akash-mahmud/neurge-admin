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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    SelectChangeEvent,
    Chip,
    Tab
} from '@mui/material';
import { Button, Divider, Pagination, Popconfirm, Spin, Upload, UploadFile, UploadProps } from 'antd';

import PageContainer from '../../../src/components/container/PageContainer';

import ParentCard from '../../../src/components/shared/ParentCard';
import BlankCard from '../../../src/components/shared/BlankCard';
import { IconEdit, IconHeart, IconPhone, IconSearch, IconTrash, IconUser } from '@tabler/icons-react';
import { CategoryCreateInput, CategoryUpdateInput, SortOrder, useAggregateCategoryQuery, useAddonBlogCategoriesForTableViewQuery, useCategoryDataForUpdateLazyQuery, useCreateOneCategoryMutation, useDeleteOneCategoryMutation, useUpdateOneCategoryMutation, AddonBlogCategoryCreateInput, useAddonForSelectQuery, useCreateOneAddonBlogCategoryMutation, useAggregateAddonBlogCategoryQuery, useDeleteOneAddonBlogCategoryMutation, AddonBlogCategoryUpdateInput, useAddonBlogCategoryForUpdateLazyQuery, useUpdateOneAddonBlogCategoryMutation, useUsersDataForTableViewQuery, UserRole, useAggregateUserQuery, UserCreateInput, useCategoriesWithoutRelationFieldQuery, useRegisterByAdminMutation, useUserLazyQuery, MutationUpdateOneUserArgs, useUploadFileMutation, useDeleteOneUserMutation } from '@/graphql/generated/schema';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CustomCheckbox from '@/components/forms/theme-elements/CustomCheckbox';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { UserUpdateInput } from '@/graphql/generated/schema';
import { useUserUpdateByAdminMutation } from '@/graphql/generated/schema';
import { RcFile } from 'antd/es/upload';
import { uniqueId } from 'lodash';
import { getImage } from '@/utils/getimage';

const columns = [
    { id: 'pname', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'email', minWidth: 100 },
    { id: 'Avater', label: 'Avater', minWidth: 100 },
    {
        id: 'nurgePlus',
        label: 'nurgePlus?',
        minWidth: 50,
    },
    {
        id: 'purchasedCategories',
        label: 'purchasedCategories?',
        minWidth: 50,
    },
    {
        id: 'purchasedAddons',
        label: 'purchasedAddons',
        minWidth: 50,
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
    const [fileList, setFileList] = useState<any[]>([])

    const [order, setorder] = useState()
    const { data, loading, error, refetch } = useUsersDataForTableViewQuery({
        variables: {
            take: limit,
            skip: skip * limit,
            orderBy: [{
                updatedAt: SortOrder.Desc
            }],
            where: {
                role: {
                    equals: UserRole.Public
                }
            }
        }
    })
    const { data: categories , loading:categoryLoading ,  } = useCategoriesWithoutRelationFieldQuery()

    const { data: total, refetch: refetchTotal , loading:aggregeateUserDataloading } = useAggregateUserQuery({
        variables: {
            where: {
                role: {
                    equals: UserRole.Public
                }
            }
        }
    })
    const [open, setOpen] = useState(false);
    const [input, setinput] = useState<UserUpdateInput>({
        name: {
            set: ''
        },
        email: {
            set: ''
        },
        nurgePlus: {
            set: false
        },
        purchasedAddons: {
            connect: []
        },
        purchasedCategories: {
            connect: []
        }
    })
    const [createInput, setcreateInput] = useState<UserCreateInput>({
        name: '',
        email: '',
        password: '',
        avater: '',
        nurgePlus: false,
        purchasedAddons: {
            connect: [
                // {
                //     id:''
                // }
            ]
        },
        purchasedCategories: {
            connect: [
                // {
                //     id:''
                // }
            ]
        },
        role: UserRole.Public

    })
    const [LoadUser,{loading:singleUserLoading}] = useUserLazyQuery({
        fetchPolicy: 'network-only'
    })
    const [userId, setuserId] = useState<string>()
    const { data: addonForselect , loading:AddonLoading} = useAddonForSelectQuery()

    const handleClickOpen = async (id?: string) => {
        if (id) {
            const { data } = await LoadUser({
                variables: {

                    where: {
                        id: id
                    }
                }
            })
            setuserId(id)
            if (data?.user) {
                setinput({

                    name: {
                        set: data.user.name as string
                    },
                    email: {
                        set: data.user.email as string
                    },
                    purchasedCategories: {
                        connect: data.user.purchasedCategories.map((category) => { return { id: category.id } })
                    },
                    purchasedAddons: {
                        connect: data.user.purchasedAddons.map((category) => { return { id: category.id } })
                    },
                    nurgePlus: { set: data.user.nurgePlus }

                })
                data.user.avater ?   setFileList([{
                    uid: uniqueId(),
                    name:data.user.avater ,
                    status: 'done',
                    url: getImage(data.user.avater  ),
                  }]): null

            }
        }


        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        setuserId(undefined)
    };
    const [UpdateUserByAdmin , {loading:updateLoading}] = useUserUpdateByAdminMutation()
    const [RegisterUser ,  {loading:createLoading}] = useRegisterByAdminMutation()
    const [DeleteUser , {loading: deleteUserLoading}] = useDeleteOneUserMutation()
    const deleteData = async (userId: string) => {
        await DeleteUser({
            variables: {
                where: {
                    id: userId
                }
            }
        })
        await refetchTotal()
        await refetch()
    }
    const update = async () => {
        await UpdateUserByAdmin({
            variables: {
                data: input,
                where: {
                    id: userId
                }
            }
        })
        handleClose()
        await refetchTotal()
        await refetch()

    }
    const create = async () => {
        if (createInput) {
            await RegisterUser({
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
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {

        setPreviewImage(file.url as string);
        setPreviewOpen(true);
    };



    const uploadButton = (
        <Box>
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </Box>
    );
    const COMMON_TAB = [
        { value: '1', icon: <IconPhone width={20} height={20} />, label: 'Profile', disabled: false },
        { value: '2', icon: <IconHeart width={20} height={20} />, label: 'Password', disabled: false },
    ];


    const [value, setValue] = useState('1');

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    const [FileUpload, { loading: loadingUpload }] = useUploadFileMutation()


    const handleBeforeUpload = async (file: RcFile): Promise<void> => {


        const { data } = await FileUpload({
            variables: {
                file
            },
        });
        setFileList([{
            uid: uniqueId(),
            name: data?.uploadFile?.file as string,
            status: 'done',
            url: getImage(data?.uploadFile?.file as string),
        }])
        setcreateInput({
            ...createInput,
            avater: data?.uploadFile?.file as string
        })
        console.log(createInput);
        
    };
    const handleBeforeUploadUpdate = async (file: RcFile): Promise<void> => {


        const { data } = await FileUpload({
            variables: {
                file
            },
        });
        setFileList([{
            uid: uniqueId(),
            name: data?.uploadFile?.file as string,
            status: 'done',
            url: getImage(data?.uploadFile?.file as string),
        }])
        setinput({
            ...input,
            avater: { set: data?.uploadFile?.file as string }
        })
        console.log(input);

    };
    return (
        <>

            <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">

                <Dialog hideBackdrop disableEnforceFocus style={{
                    zIndex: 1
                }} open={open} onClose={handleClose} fullWidth maxWidth={'md'} >
                    <DialogTitle>{userId ? 'Update' : 'Create'} User</DialogTitle>
                    <DialogContent>
                        <Spin spinning={loadingUpload}>

                        {
                            userId ?
                                <Spin spinning={updateLoading}>
                                    <Box>
                                        <TabContext value={value}>
                                            <Box>
                                                <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                                    {COMMON_TAB.map((tab, index) => (
                                                        <Tab key={tab.value} label={tab.label} value={String(index + 1)} disabled={index + 1 === 2} />
                                                    ))}
                                                </TabList>
                                            </Box>
                                            <Divider />
                                            <Box mt={2}>

                                                <TabPanel value={'1'}>
                                                    <>

                                                        <Box mt={2} display={'flex'} justifyContent={'space-around'}>

                                                            <CustomTextField value={input?.name?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                setinput({
                                                                    ...input,
                                                                    name: { set: e.target.value }
                                                                })
                                                            }} style={{
                                                                margin: '10px'
                                                            }}
                                                                autoFocus
                                                                id="name"
                                                                label=" Name"
                                                                type="text"
                                                                fullWidth
                                                            />
                                                            <CustomTextField value={input?.email?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                setinput({
                                                                    ...input,
                                                                    email: { set: e.target.value }
                                                                })
                                                            }} style={{
                                                                margin: '10px'
                                                            }}
                                                                autoFocus
                                                                id="name"
                                                                label="email"
                                                                type="email"
                                                                fullWidth
                                                            />


                                                        </Box>
                                                        <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>

                                                            <FormControl style={{
                                                                marginTop: '10px'
                                                            }} fullWidth>
                                                                <InputLabel id="demo-simple-select-label">Purchased Categories</InputLabel>
                                                                <Select multiple
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={input?.purchasedCategories?.connect?.map((obj) => obj.id)}
                                                                    label="Purchased Categories"

                                                                    onChange={(event) => {
                                                                        console.log(event.target.value);

                                                                        setinput({
                                                                            ...input,
                                                                            purchasedCategories: {
                                                                                // @ts-ignore

                                                                                connect: event.target.value?.map((id) => {
                                                                                    return { id }
                                                                                }
                                                                                )
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
                                                        <Box>
                                                            <FormControl style={{
                                                                marginTop: '10px'
                                                            }} fullWidth>
                                                                <InputLabel id="demo-simple-select-label">Addons</InputLabel>
                                                                <Select multiple
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={input?.purchasedAddons?.connect?.map((obj) => obj.id)}
                                                                    label="Purchased addons"

                                                                    onChange={(event) => {

                                                                        setinput({
                                                                            ...input,
                                                                            purchasedAddons: {
                                                                                // @ts-ignore

                                                                                connect: event.target.value?.map((id) => {
                                                                                    return { id }
                                                                                }
                                                                                )
                                                                            }
                                                                        })
                                                                    }}
                                                                >
                                                                    {
                                                                        addonForselect?.addons?.map((addon) => (
                                                                            <MenuItem value={addon.id}>{addon.name}</MenuItem>
                                                                        ))
                                                                    }

                                                                </Select>
                                                            </FormControl>
                                                        </Box>
                                                        <Box mt={2} display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>




                                                            <Upload multiple={false} maxCount={1}

                                                                beforeUpload={(args) => handleBeforeUploadUpdate(args)}
                                                                onRemove={() => {
                                                                    setFileList([])
                                                                    setinput({
                                                                        ...input,
                                                                        avater: {
                                                                            set: ''
                                                                        }
                                                                    })
                                                                }}
                                                                listType="picture-circle"
                                                                fileList={fileList}
                                                                onPreview={handlePreview}
                                                            >
                                                                {fileList.length >= 8 ? null : uploadButton}
                                                            </Upload>
                                                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                                                <InputLabel >Nurge plus?</InputLabel>
                                                                <CustomCheckbox checked={input?.nurgePlus?.set as boolean} onChange={(event) => {
                                                                    setinput({
                                                                        ...input,
                                                                        nurgePlus: { set: event.target.checked }
                                                                    })
                                                                }} />
                                                            </Box>
                                                        </Box>
                                                    </>
                                                </TabPanel>
                                                <TabPanel style={{
                                                    backgroundColor: 'unset'
                                                }} value={'2'}>
                                                    <>

                                                        <Box mt={2} display={'flex'} justifyContent={'space-around'}>

                                                            <CustomTextField value={createInput?.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                setcreateInput({
                                                                    ...createInput,
                                                                    name: e.target.value
                                                                })
                                                            }} style={{
                                                                margin: '10px'
                                                            }}
                                                                autoFocus
                                                                id="name"
                                                                label=" Name"
                                                                type="text"
                                                                fullWidth
                                                            />

                                                            <CustomTextField value={createInput?.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                setcreateInput({
                                                                    ...createInput,
                                                                    password: e.target.value
                                                                })
                                                            }} style={{
                                                                margin: '10px'
                                                            }}
                                                                autoFocus
                                                                id="name"
                                                                label="password"
                                                                type="password"
                                                                fullWidth
                                                            />

                                                        </Box>

                                                        <Box>

                                                        </Box>

                                                    </>
                                                </TabPanel>
                                            </Box>

                                        </TabContext>
                                    </Box>
                                </Spin> :
                                <Spin spinning={createLoading}>

                                    <Box mt={2} display={'flex'} justifyContent={'space-around'}>

                                        <CustomTextField value={createInput?.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setcreateInput({
                                                ...createInput,
                                                name: e.target.value
                                            })
                                        }} style={{
                                            margin: '10px'
                                        }}
                                            autoFocus
                                            id="name"
                                            label=" Name"
                                            type="text"
                                            fullWidth
                                        />
                                        <CustomTextField value={createInput?.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setcreateInput({
                                                ...createInput,
                                                email: e.target.value
                                            })
                                        }} style={{
                                            margin: '10px'
                                        }}
                                            autoFocus
                                            id="name"
                                            label="email"
                                            type="email"
                                            fullWidth
                                        />
                                        <CustomTextField value={createInput?.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setcreateInput({
                                                ...createInput,
                                                password: e.target.value
                                            })
                                        }} style={{
                                            margin: '10px'
                                        }}
                                            autoFocus
                                            id="name"
                                            label="password"
                                            type="password"
                                            fullWidth
                                        />

                                    </Box>
                                    <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>

                                        <FormControl style={{
                                            marginTop: '10px'
                                        }} fullWidth>
                                            <InputLabel id="demo-simple-select-label">Purchased Categories</InputLabel>
                                            <Select multiple
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={createInput?.purchasedCategories?.connect?.map((obj) => obj.id)}
                                                label="Purchased Categories"

                                                onChange={(event) => {
                                                    console.log(event.target.value);

                                                    setcreateInput({
                                                        ...createInput,
                                                        purchasedCategories: {
                                                            // @ts-ignore

                                                            connect: event.target.value?.map((id) => {
                                                                return { id }
                                                            }
                                                            )
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
                                    <Box>
                                        <FormControl style={{
                                            marginTop: '10px'
                                        }} fullWidth>
                                            <InputLabel id="demo-simple-select-label">Addons</InputLabel>
                                            <Select multiple
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={createInput?.purchasedAddons?.connect?.map((obj) => obj.id)}
                                                label="Purchased addons"

                                                onChange={(event) => {

                                                    setcreateInput({
                                                        ...createInput,
                                                        purchasedAddons: {
                                                            // @ts-ignore

                                                            connect: event.target.value?.map((id) => {
                                                                return { id }
                                                            }
                                                            )
                                                        }
                                                    })
                                                }}
                                            >
                                                {
                                                    addonForselect?.addons?.map((addon) => (
                                                        <MenuItem value={addon.id}>{addon.name}</MenuItem>
                                                    ))
                                                }

                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box mt={2} display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>




                                        <Upload multiple={false} maxCount={1}

                                            beforeUpload={(args) => handleBeforeUpload(args)}
                                            onRemove={() => {
                                                setFileList([])
                                                setcreateInput({
                                                    ...createInput,
                                                    avater: ''
                                                })
                                            }}
                                            listType="picture-circle"
                                            fileList={fileList}
                                            onPreview={handlePreview}
                                        >
                                            {fileList.length >= 8 ? null : uploadButton}
                                        </Upload>
                                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                            <InputLabel>Nurge plus?</InputLabel>
                                            <CustomCheckbox onChange={(event) => {
                                                setcreateInput({
                                                    ...createInput,
                                                    nurgePlus: event.target.checked
                                                })
                                            }} />
                                        </Box>
                                    </Box>
                                </Spin>
                        }
                        </Spin>

                    </DialogContent>
                    <DialogActions>
                        <Button color="error" onClick={handleClose}>Cancel</Button>
                        <Button onClick={userId ? update : create}>{userId ? 'Update' : 'Create'}</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
<Spin spinning={loading||deleteUserLoading ||aggregeateUserDataloading || singleUserLoading || categoryLoading|| AddonLoading }>

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
                                        {data?.users.map((user) => {
                                            return (
                                                <TableRow hover key={user.id}>
                                                    <TableCell>
                                                        {user.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="subtitle2" fontWeight="500">
                                                            {user.email}
                                                        </Typography>


                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="subtitle2">
                                                            <Avatar src={getImage(user.avater as string)} />

                                                        </Typography>

                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography
                                                            variant="subtitle2" fontWeight="500">
                                                            {user.nurgePlus ? 'Yes' : 'No'}
                                                        </Typography>


                                                    </TableCell>


                                                    <TableCell>
                                                        <Typography
                                                            variant="subtitle2" fontWeight="500">
                                                            {user?._count?.purchasedCategories}
                                                        </Typography>


                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="subtitle2" fontWeight="500">
                                                            {user?._count?.purchasedAddons}
                                                        </Typography>


                                                    </TableCell>

                                                    <Popconfirm onConfirm={() => deleteData(user.id)} title="Are you sure?">

                                                        <IconButton>
                                                            <IconTrash width={18} />
                                                        </IconButton>
                                                    </Popconfirm>
                                                    <IconButton onClick={() => handleClickOpen(user.id)}>
                                                        <IconEdit width={18} />
                                                    </IconButton>





                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                            <Box pb={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>

                                <Pagination current={skip + 1} onChange={(pageNumber) => {
                                    setskip(pageNumber - 1)

                                }} total={total?.aggregateUser._count?._all} pageSize={limit} />
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
