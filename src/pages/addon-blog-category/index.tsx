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
    MenuItem
} from '@mui/material';
import { Button, Pagination, Popconfirm, Spin } from 'antd';

import PageContainer from '../../../src/components/container/PageContainer';

import ParentCard from '../../../src/components/shared/ParentCard';
import BlankCard from '../../../src/components/shared/BlankCard';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { CategoryCreateInput, CategoryUpdateInput, SortOrder, useAggregateCategoryQuery, useAddonBlogCategoriesForTableViewQuery, useCategoryDataForUpdateLazyQuery, useCreateOneCategoryMutation, useDeleteOneCategoryMutation, useUpdateOneCategoryMutation, AddonBlogCategoryCreateInput, useAddonForSelectQuery, useCreateOneAddonBlogCategoryMutation, useAggregateAddonBlogCategoryQuery, useDeleteOneAddonBlogCategoryMutation, AddonBlogCategoryUpdateInput, useAddonBlogCategoryForUpdateLazyQuery, useUpdateOneAddonBlogCategoryMutation } from '@/graphql/generated/schema';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useState } from 'react';

const columns = [
    { id: 'pname', label: 'Name', minWidth: 170 },
    { id: 'Addon', label: 'Addon', minWidth: 100 },
    {
        id: 'Blogs',
        label: 'Blogs',
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
    const { data, loading, error, refetch } = useAddonBlogCategoriesForTableViewQuery({
        variables: {
            take: limit,
            skip: skip * limit,
            orderBy: [{
                updatedAt: SortOrder.Desc
            }]
        }
    })
    const { data: total, refetch: refetchTotal , loading:aggregeateLoading } = useAggregateAddonBlogCategoryQuery()
    const [open, setOpen] = useState(false);
    const [input, setinput] = useState<AddonBlogCategoryUpdateInput>({
    })
    const [createInput, setcreateInput] = useState<AddonBlogCategoryCreateInput>({
        name: '',
        addon: {
            connect: {
                id: ''
            }
        }
    })
    const [LoadAddonBlogCategory,{loading:loadAddonBlogSingleLoading}] = useAddonBlogCategoryForUpdateLazyQuery()
    const [addonBlogCategoryId, setaddonBlogCategoryId] = useState<string>()
    const handleClickOpen = async (id?: string) => {
        if (id) {
            const { data } = await LoadAddonBlogCategory({
                variables: {

                    where: {
                        id: id
                    }
                }
            })
            setaddonBlogCategoryId(id)
            if (data?.addonBlogCategory) {
                setinput({
                    name: {
                        set: data.addonBlogCategory.name as string
                    },
                    addon: {
                        connect: {
                            id: data.addonBlogCategory.addonId
                        }
                    }
                })


            }
        }


        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        setaddonBlogCategoryId(undefined)
    };
    const [UpdateAddonVlogCategory, {loading:updateLoading}] = useUpdateOneAddonBlogCategoryMutation()
    const [CreateAddonBlogCategory , {loading:createLoading}] = useCreateOneAddonBlogCategoryMutation()
    const [DeleteAddonBlogCategory , {loading:deleteLoading}] = useDeleteOneAddonBlogCategoryMutation()
    const deleteData = async (addonBlogCategoryId: string) => {
        await DeleteAddonBlogCategory({
            variables: {
                where: {
                    id: addonBlogCategoryId
                }
            }
        })
        await refetchTotal()
        await refetch()
    }
    const update = async () => {
        await UpdateAddonVlogCategory({
            variables: {
                data: input,
                where: {
                    id: addonBlogCategoryId
                }
            }
        })
        handleClose()
        await refetchTotal()
        await refetch()

    }
    const { data: addonForselect } = useAddonForSelectQuery()
    const create = async () => {
        if (createInput) {
            await CreateAddonBlogCategory({
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

                <Dialog hideBackdrop disableEnforceFocus style={{
                    zIndex: 1
                }} open={open} onClose={handleClose} fullWidth maxWidth={'md'} >
                    <DialogTitle>{addonBlogCategoryId ? 'Update' : 'Create'} Category</DialogTitle>
                    <DialogContent>
                        {
                            addonBlogCategoryId ? <Spin spinning={updateLoading}>
 <Box mt={2} display={'flex'} justifyContent={'space-around'}>

<CustomTextField value={input.name?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    setinput({
        ...input,
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
<FormControl style={{
    marginTop: '5px'
}} fullWidth>
    <InputLabel id="demo-simple-select-label">Category</InputLabel>
    <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={input?.addon?.connect?.id}
        label="Category"
        onChange={(event) => {
            setinput({
                ...input,
                addon: {
                    connect: {
                        id: event.target.value
                    }
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
                            </Spin>
                           : <Spin spinning={createLoading}>
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
    label="Category Name"
    type="text"
    fullWidth
/>

<FormControl style={{
    marginTop: '5px'
}} fullWidth>
    <InputLabel id="demo-simple-select-label">Category</InputLabel>
    <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={createInput?.addon?.connect?.id}
        label="Category"
        onChange={(event) => {
            setcreateInput({
                ...createInput,
                addon: {
                    connect: {
                        id: event.target.value
                    }
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
                           </Spin>
                             
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button color="error" onClick={handleClose}>Cancel</Button>
                        <Button onClick={addonBlogCategoryId ? update : create}>{addonBlogCategoryId ? 'Update' : 'Create'}</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
<Spin spinning={loadAddonBlogSingleLoading || loading || deleteLoading || aggregeateLoading}>

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
                                        {data?.addonBlogCategories.map((addonBlogCategory) => {
                                            return (
                                                <TableRow hover key={addonBlogCategory.id}>
                                                    <TableCell>
                                                        {addonBlogCategory.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="subtitle2" fontWeight="500">
                                                            {addonBlogCategory.addon?.name}
                                                        </Typography>


                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="subtitle2">
                                                            {addonBlogCategory._count?.blog}

                                                        </Typography>

                                                    </TableCell>

                                                    <TableCell>
                                                        <Popconfirm onConfirm={() => deleteData(addonBlogCategory.id)} title="Are you sure?">

                                                            <IconButton>
                                                                <IconTrash width={18} />
                                                            </IconButton>
                                                        </Popconfirm>
                                                        <IconButton onClick={() => handleClickOpen(addonBlogCategory.id)}>
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

                                }} total={total?.aggregateAddonBlogCategory._count?._all} pageSize={limit} />
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
