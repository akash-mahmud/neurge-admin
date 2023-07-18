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
import { Button, Pagination, Popconfirm, Popover, Spin } from 'antd';
import { default as emojiData } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import PageContainer from '../../../src/components/container/PageContainer';

import ParentCard from '../../../src/components/shared/ParentCard';
import BlankCard from '../../../src/components/shared/BlankCard';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { CategoryCreateInput, CategoryUpdateInput, SortOrder, useAggregateCategoryQuery, useAddonBlogCategoriesForTableViewQuery, useCategoryDataForUpdateLazyQuery, useCreateOneCategoryMutation, useDeleteOneCategoryMutation, useUpdateOneCategoryMutation, AddonBlogCategoryCreateInput, useAddonForSelectQuery, useCreateOneAddonBlogCategoryMutation, useAggregateAddonBlogCategoryQuery, useDeleteOneAddonBlogCategoryMutation, AddonBlogCategoryUpdateInput, useAddonBlogCategoryForUpdateLazyQuery, useUpdateOneAddonBlogCategoryMutation, useBlogsForTableViewQuery, useAggregateBlogQuery, BlogCreateInput, useCreateOneBlogMutation, useAddonBlogCategoriesForSelectQuery, useDeleteOneBlogMutation, useBlogForUpdateLazyQuery, BlogUpdateInput } from '@/graphql/generated/schema';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useState } from 'react';
import { EmojiEmotions } from '@mui/icons-material';
import dynamic from "next/dynamic";
import { useUpdateOneBlogMutation } from '@/graphql/generated/schema';
const ReactQuill = dynamic(import('react-quill'), { ssr: false })
const columns = [
    { id: 'title', label: 'title', minWidth: 170 },
    { id: 'imoji', label: 'imoji', minWidth: 100 },
    {
        id: 'addon',
        label: 'addon',
        minWidth: 170,
    },
    {
        id: 'addonBlogCategory',
        label: 'addonBlogCategory',
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
    const { data, loading, error, refetch } = useBlogsForTableViewQuery({
        variables: {
            take: limit,
            skip: skip * limit,
            orderBy: [{
                updatedAt: SortOrder.Desc
            }]
        }
    })
    const { data: total, refetch: refetchTotal, loading:aggregeateLoading } = useAggregateBlogQuery()
    const [open, setOpen] = useState(false);
    const [input, setinput] = useState<BlogUpdateInput>({
    })
    const [createInput, setcreateInput] = useState<BlogCreateInput>({
        title: '',
        addon: {
            connect: {
                id: ''
            }
        },
        imoji: '',
        description: '',
        addonBlogCategory: {
            connect: {
                id: ''
            }
        }

    })
    const [LoadBlog,{loading:singleBlogDataLoading}] = useBlogForUpdateLazyQuery({
        fetchPolicy:'network-only'
    })
    const [blogId, setblogId] = useState<string>()
    const handleClickOpen = async (id?: string) => {
        if (id) {
            const { data } = await LoadBlog({
                variables: {

                    where: {
                        id: id
                    }
                }
            })
            setblogId(id)
            if (data?.blog) {
                setinput({
                    title: {
                        set: data.blog.title as string
                    },
                    addon: {
                        connect: {
                            id: data.blog.addonId
                        }
                    },
                    addonBlogCategory: {
                        connect: {
                            id: data.blog.addonBlogCategoryId
                        }
                    },
                    imoji: { set: data.blog.imoji },
                    description: {
                        set: data.blog.description
                    }

                })


            }
        }


        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        setblogId(undefined)
    };
    const [UpdateBlog, {loading: updateLoading}] = useUpdateOneBlogMutation()
    const [CreateOneBlog , {loading: createLoading}] = useCreateOneBlogMutation()
    const [DeleteBlog , {loading:deleteLoading}] = useDeleteOneBlogMutation()
    const deleteData = async (blogId: string) => {
        await DeleteBlog({
            variables: {
                where: {
                    id: blogId
                }
            }
        })
        await refetchTotal()
        await refetch()
    }
    const update = async () => {
        await UpdateBlog({
            variables: {
                data: input,
                where: {
                    id: blogId
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
            await CreateOneBlog({
                variables: {
                    data: createInput,

                }
            })
            handleClose()
            await refetchTotal()

            await refetch()
        }

    }
    const { data: AddonBlogCategoryForSelect } = useAddonBlogCategoriesForSelectQuery({
        variables: {
            where: {
                addonId: {
                    equals: blogId ? input.addon?.connect?.id : createInput.addon?.connect?.id
                }
            }
        }
    })
    return (
        <>
            <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">

                <Dialog hideBackdrop disableEnforceFocus style={{
                    zIndex: 1
                }} open={open} onClose={handleClose} fullWidth maxWidth={'md'} >
                    <DialogTitle>{blogId ? 'Update' : 'Create'} Category</DialogTitle>
                    <DialogContent>
                        {
                            blogId ?
                                <Spin spinning={updateLoading}>

                                    <Box mt={2} display={'flex'} justifyContent={'space-around'}>

                                        <CustomTextField value={input.title?.set} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setinput({
                                                ...input,
                                                title: {
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

                                    <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>

                                        <FormControl style={{
                                            marginTop: '10px'
                                        }} fullWidth>
                                            <InputLabel id="demo-simple-select-label">Addon Blog Category</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={input?.addonBlogCategory?.connect?.id}
                                                label="Category"
                                                onChange={(event) => {
                                                    setinput({
                                                        ...input,
                                                        addonBlogCategory: {
                                                            connect: {
                                                                id: event.target.value
                                                            }
                                                        }
                                                    })
                                                }}
                                            >
                                                {
                                                    AddonBlogCategoryForSelect?.addonBlogCategories?.map((addonBlogCategory) => (
                                                        <MenuItem value={addonBlogCategory.id}>{addonBlogCategory.name}</MenuItem>
                                                    ))
                                                }

                                            </Select>
                                        </FormControl>
                                        <TextField style={{
                                            marginTop: '10px',
                                            marginLeft: 10

                                        }}

                                            onChange={(event) => {
                                                setinput({
                                                    ...input,
                                                    imoji: {set:event.target.value}

                                                })
                                            }}
                                            value={input.imoji?.set}
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
                                                                    imoji: {set:data.native}

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
                                    <Box mt={3}>
                                        <ReactQuill style={{
                                            height: 200
                                        }}
                                            value={input.description?.set as string}
                                            onChange={(value) => {
                                                setinput({
                                                    ...input,
                                                    description: {set:value}
                                                })
                                            }}
                                            placeholder="Description"
                                        />
                                    </Box>

                                </Spin>

                                :
                                <Spin spinning={createLoading}>

                                    <Box mt={2} display={'flex'} justifyContent={'space-around'}>

                                        <CustomTextField value={createInput?.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setcreateInput({
                                                ...createInput,
                                                title: e.target.value
                                            })
                                        }} style={{
                                            margin: '10px'
                                        }}
                                            autoFocus
                                            id="name"
                                            label="title"
                                            type="text"
                                            fullWidth
                                        />

                                        <FormControl style={{
                                            marginTop: '10px'
                                        }} fullWidth>
                                            <InputLabel id="demo-simple-select-label">Addon</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={createInput?.addon?.connect?.id}
                                                label="Addon"
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
                                    <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>

                                        <FormControl style={{
                                            marginTop: '10px'
                                        }} fullWidth>
                                            <InputLabel id="demo-simple-select-label">Addon Blog Category</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={createInput?.addonBlogCategory?.connect?.id}
                                                label="Category"
                                                onChange={(event) => {
                                                    setcreateInput({
                                                        ...createInput,
                                                        addonBlogCategory: {
                                                            connect: {
                                                                id: event.target.value
                                                            }
                                                        }
                                                    })
                                                }}
                                            >
                                                {
                                                    AddonBlogCategoryForSelect?.addonBlogCategories?.map((addonBlogCategory) => (
                                                        <MenuItem value={addonBlogCategory.id}>{addonBlogCategory.name}</MenuItem>
                                                    ))
                                                }

                                            </Select>
                                        </FormControl>
                                        <TextField style={{
                                            marginTop: '10px',
                                            marginLeft: 10

                                        }}

                                            onChange={(event) => {
                                                setcreateInput({
                                                    ...createInput,
                                                    imoji: event.target.value

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
                                    <Box mt={3}>
                                        <ReactQuill style={{
                                            height: 200
                                        }}
                                            value={createInput.description}
                                            onChange={(value) => {
                                                setcreateInput({
                                                    ...createInput,
                                                    description: value
                                                })
                                            }}
                                            placeholder="Description"
                                        />
                                    </Box>

                                </Spin>
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button color="error" onClick={handleClose}>Cancel</Button>
                        <Button onClick={blogId ? update : create}>{blogId ? 'Update' : 'Create'}</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
<Spin spinning={loading || aggregeateLoading || deleteLoading || singleBlogDataLoading}>

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
                                        {data?.blogs.map((blog) => {
                                            return (
                                                <TableRow hover key={blog.id}>
                                                    <TableCell>
                                                        {blog.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        {blog.imoji}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="subtitle2" fontWeight="500">
                                                            {blog.addon?.name}
                                                        </Typography>


                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="subtitle2">
                                                            {blog.addonBlogCategory?.name}

                                                        </Typography>

                                                    </TableCell>

                                                    <TableCell>
                                                        <Popconfirm onConfirm={() => deleteData(blog.id)} title="Are you sure?">

                                                            <IconButton>
                                                                <IconTrash width={18} />
                                                            </IconButton>
                                                        </Popconfirm>
                                                        <IconButton onClick={() => handleClickOpen(blog.id)}>
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

                                }} total={total?.aggregateBlog._count?._all} pageSize={limit} />
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
