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
  Chip,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material';
import { Button, Input, Pagination, Popconfirm, Popover, Spin } from 'antd';
import slugify from 'slugify'

import { default as emojiData } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { SortOrder, TaskCreateInput, useAggregateCategoryQuery, useAggregateTaskQuery, useCategoriesWithoutRelationFieldQuery, useCategoryDataForUpdateLazyQuery, useUpdateManyTaskMutation, useTasksViewTableQuery, useUpdateManyTipMutation, useUpdateManyPromptMutation, useDeleteOnePromptMutation, TaskUpdateInput, useDeleteOneTipMutation, usePromptsAfterDeleteFromtasksLazyQuery, useTipsAfterDeleteFromTaskLazyQuery, useUpdateOneTaskMutation } from '@/graphql/generated/schema';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useState } from 'react';
import PageContainer from '@/components/container/PageContainer';
import BlankCard from '@/components/shared/BlankCard';
import ParentCard from '@/components/shared/ParentCard';
import EmojiPicker from 'emoji-picker-react';
import { EmojiEmotions } from '@mui/icons-material';
import CreateTag from '@/components/task/tags/Create';
import { uniqueId } from 'lodash';
import { useCreateOneTaskMutation, useDeleteManyPromptMutation, useDeleteManyTipMutation, useDeleteOneTaskMutation, useTaskLazyQuery } from '@/graphql/generated/schema';


const columns = [
  { id: 'pname', label: 'Name', minWidth: 170 },
  { id: 'category', label: 'products', minWidth: 100 },
  {
    id: 'tags',
    label: 'Tags',
    minWidth: 170,
  },

  {
    id: 'prompts',
    label: 'Prompts',
    minWidth: 170,
  },
  {
    id: 'tips',
    label: 'tips',
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
  const [tags, setTags] = useState<string[]>([]);
  const { data, loading, error, refetch } = useTasksViewTableQuery({
    variables: {
      take: limit,
      skip: skip * limit,
      orderBy: [{
        updatedAt: SortOrder.Desc
      }]
    }
  })
  const { data: total, refetch: refetchTotal } = useAggregateTaskQuery()
  const [open, setOpen] = useState(false);
  const [input, setinput] = useState<TaskUpdateInput>({
  })
  const [tips, settips] = useState([{
    id: uniqueId(),
    description: '',
  }])

  const [prompts, setprompts] = useState([{
    id: uniqueId(),
    name: '',
    description: '',
  }])
  const [createInput, setcreateInput] = useState<TaskCreateInput>({
    name: '',
    description: '', tags: {
      set: ['']
    },
    imoji: '',
    slug: ''
  })
  const [LoadCategory,] = useCategoryDataForUpdateLazyQuery()
  const [LoadTask] = useTaskLazyQuery({ fetchPolicy: 'network-only' })
  const [LoadPrompts] = usePromptsAfterDeleteFromtasksLazyQuery()
  const [LoadTips] = useTipsAfterDeleteFromTaskLazyQuery()
  const [taskId, settaskId] = useState<string>()
  const handleClickOpen = async (id?: string) => {
    if (id) {
      const { data } = await LoadTask({
        variables: {

          where: {
            id: id
          }
        }
      })
      settaskId(id)
      if (data?.task) {
        const { name, description, tags, imoji, prompts: taskPrompts, tips, categoryId, slug } = data?.task
        setinput(() => {
          return {
            name: {
              set: name
            },
            description: {
              set: description
            },
            imoji: {
              set: imoji
            },
            slug: {
              set: slug
            },
            category: {
              connect: {
                id: categoryId
              }
            },

          }
        })
        settips(tips)
        setprompts(taskPrompts)
        setTags(tags)

      }
    }


    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
    settaskId(undefined)
    setinput({

    })
    setcreateInput({
      name: '',
      description: '', tags: {
        set: ['']
      },
      imoji: '',
      slug: ''
    })
    setTags([])
    setprompts([{ id: uniqueId(), name: '', description: '' }])
    settips([{ id: uniqueId(), description: '' }])
  };
  const [UpdateTask] = useUpdateOneTaskMutation()
  const [UpdateManyTips, { loading: updatetipsLoading }] = useUpdateManyTipMutation()
  const [UpdateManyPrompts, { loading: promptsUpdateLoading }] = useUpdateManyPromptMutation()
  const [CreateOneTask] = useCreateOneTaskMutation()
  const [DeleteTask] = useDeleteOneTaskMutation()
  const [DeleteTipsRelatedTask] = useDeleteManyTipMutation()
  const [DeletePromptsRelatedTask] = useDeleteManyPromptMutation()
  const [DeletePrompt] = useDeleteOnePromptMutation()
  const [DeleteTips] = useDeleteOneTipMutation()
  const deleteData = async (taskId: string) => {
    const { data } = await LoadTask({
      variables: {

        where: {
          id: taskId
        }
      }
    })
    if (data?.task?.id) {

      const promptsId = data.task.prompts.map((prompt) => {
        return prompt.id
      })
      const tipsId = data.task.tips.map((tip) => {
        return tip.id
      })
      const deleteTask = DeleteTask({
        variables: {
          where: {
            id: data?.task?.id
          }
        }
      })
      const deletePrompts = DeletePromptsRelatedTask({
        variables: {
          where: {

            id: {
              in: promptsId
            }
          }
        }
      })
      const deleteTips = DeleteTipsRelatedTask({
        variables: {
          where: {
            id: {
              in: tipsId
            }
          }
        }
      })
      await Promise.all([deleteTask, deletePrompts, deleteTips])

    }

    await refetchTotal()
    await refetch()
  }
  const update = async () => {
    if (taskId) {
      await UpdateTask({
        variables: {
          data: {
            ...input,
            tags: {
              set: tags
            }
          },
          where: {
            id: taskId

          }
        }

      })

      handleClose()
      await refetchTotal()
      await refetch()
    }


  }

  const create = async () => {
    if (createInput) {

      const formatPromts = prompts.map(({ name, description }) => {
        return {
          name,
          description
        }
      })
      const formatTips = tips.map(({ description }) => {
        return {
          description
        }
      })
      await CreateOneTask({
        variables: {
          data: {
            ...createInput,
            tags: {
              set: tags
            },
            prompts: {
              createMany: {
                data: [
                  ...formatPromts
                ]
              }
            },
            tips: {
              createMany: {
                data:
                  [...formatTips]

              }
            }
          }
        }
      })

      handleClose()
      await refetchTotal()

      await refetch()
    }

  }
  const { data: categories } = useCategoriesWithoutRelationFieldQuery()
  const [updateingPrompt, setupdateingPrompt] = useState('')
  const [updatingTip, setupdatingTip] = useState('')
  return (
    <>
      <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'} style={{
          zIndex: 1
        }} hideBackdrop disableEnforceFocus >
          <DialogTitle>{taskId ? 'Update' : 'Create'} Category</DialogTitle>
          <DialogContent>
            {
              taskId ? <>
                <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexWrap={"wrap"}>
                  <Box flexBasis={'calc(33.33% - 10px)'}>

                    <TextField placeholder='Name'
                      value={input?.name?.set}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setinput({
                          ...input,
                          name: {
                            set: e.target.value
                          },
                          slug: {
                            set: slugify(e.target.value)
                          }
                        })
                      }}
                      style={{
                        margin: '10px'
                      }}
                      autoFocus
                      id="name"
                      label="Task Name"
                      type="text"
                      fullWidth
                    />
                  </Box>
                  <Box flexBasis={'calc(33.33% - 10px)'}>
                    <TextField
                      value={input?.slug?.set}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setinput({
                          ...input,
                          slug: {
                            set: slugify(e.target.value)
                          }
                        })
                      }}
                      style={{
                        margin: '10px',

                      }}
                      autoFocus
                      id="name"
                      label="Slug"
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
                            set: event.target.value
                          }
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
                                  imoji: {
                                    set: data.native
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
                  <Input.TextArea value={input.description?.set as string} onChange={(event) => {
                    setinput({
                      ...input,
                      description: {
                        set: event.target.value
                      }
                    })
                  }} placeholder='Task Description' style={{
                    margin: '10px',
                    width: '100%',
                    height: '200px'
                  }} />


                  <Box flexBasis={'calc(50.0% - 10px)'}>
                    <CreateTag tags={tags} setTags={setTags} />
                  </Box>

                  <Box flexBasis={'calc(50.0% - 10px)'}>
                    <FormControl style={{
                      marginTop: '5px'
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








                </Box>
                <Box m={1}>
                  <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>

                    <Typography mr={2}>Tips</Typography>
                    <Button onClick={() => settips([...tips, {
                      id: uniqueId(),
                      description: ''
                    }])}>Add</Button>
                  </Box>

                  {
                    tips.map((tip) => (
                      <Spin spinning={updatingTip === tip.id && updatetipsLoading}>

                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                          <Input.TextArea value={tip.description} onChange={(event) => {
                            const newState = tips.map((data) => {
                              if (data.id === tip.id) {
                                return {
                                  ...data,
                                  description: event.target.value
                                }

                              } else {
                                return data
                              }
                            })
                            settips(newState)
                          }} placeholder='Tips description' style={{
                            margin: '10px',

                          }} />
                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <Button onClick={async () => {
                              setupdatingTip(tip.id)
                              await UpdateManyTips({
                                variables: {
                                  data: {

                                    description: {
                                      set:
                                        tip.description

                                    }
                                  }
                                }
                              })
                            }} color='success'>Save changes of this tip</Button>
                            <Popconfirm zIndex={10002} title="Are you sure?" onConfirm={async () => {

                              await DeleteTips({
                                variables: {
                                  where: {
                                    id: tip.id
                                  }
                                }
                              })
                              const { data } = await LoadTips({
                                variables: {
                                  where: {
                                    taskId: {
                                      equals: taskId
                                    }
                                  }
                                }
                              })

                              settips(data?.tips || tips)

                            }}>

                              <IconButton>
                                <IconTrash width={18} />
                              </IconButton>
                            </Popconfirm>
                          </Box>

                        </Box>
                      </Spin>
                    ))
                  }
                </Box>

                <Box m={1}>

                  <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>

                    <Typography mr={2}>Prompts</Typography>
                    <Button onClick={() => setprompts([...prompts, {
                      id: uniqueId(),
                      name: '',
                      description: ''
                    }])}>Add</Button>
                  </Box>
                  {
                    prompts.map((prompt) => (
                      <Spin spinning={updateingPrompt === prompt.id && promptsUpdateLoading}>

                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>

                          <TextField value={prompt.name} onChange={(event) => {
                            const newState = prompts.map((data) => {
                              if (data.id === prompt.id) {
                                return {
                                  ...data,
                                  name: event.target.value
                                }

                              } else {
                                return data
                              }
                            })
                            setprompts(newState)
                          }} placeholder='Prompt Name' style={{
                            margin: '10px',

                          }} fullWidth />
                          <Input.TextArea value={prompt.description} onChange={(event) => {
                            const newState = prompts.map((data) => {
                              if (data.id === prompt.id) {
                                return {
                                  ...data,
                                  description: event.target.value
                                }

                              } else {
                                return data
                              }
                            })
                            setprompts(newState)
                          }} placeholder='Prompt Description' style={{
                            margin: '10px',
                            width: '100%',
                            height: '200px'
                          }} />
                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <Button onClick={async () => {
                              setupdateingPrompt(prompt.id)
                              await UpdateManyPrompts({
                                variables: {
                                  data: {
                                    name: {
                                      set:
                                        prompt.name

                                    },
                                    description: {
                                      set:
                                        prompt.description

                                    }
                                  }
                                }
                              })
                            }} color='success'>Save changes of this prompt</Button>

                            <Popconfirm zIndex={10002} title="Are you sure?" onConfirm={async () => {

                              await DeletePrompt({
                                variables: {
                                  where: {
                                    id: prompt.id
                                  }
                                }
                              })
                              const { data } = await LoadPrompts({
                                variables: {
                                  where: {
                                    taskId: {
                                      equals: taskId
                                    }
                                  }
                                }
                              })
                              setprompts(data?.prompts || prompts)

                            }}>
                              <IconButton >
                                <IconTrash width={18} />
                              </IconButton>
                            </Popconfirm>
                          </Box>


                        </Box>
                      </Spin>
                    ))
                  }
                </Box>
                {/* End update form  */}

              </> :
                <>
                  <Box mt={2} display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexWrap={"wrap"}>
                    <Box flexBasis={'calc(33.33% - 10px)'}>

                      <TextField placeholder='Name'
                        // value={createInput?.slug}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setcreateInput({
                            ...createInput,
                            name: e.target.value,
                            slug: slugify(e.target.value)
                          })
                        }}
                        style={{
                          margin: '10px'
                        }}
                        autoFocus
                        id="name"
                        label="Task Name"
                        type="text"
                        fullWidth
                      />
                    </Box>
                    <Box flexBasis={'calc(33.33% - 10px)'}>
                      <TextField
                        // value={createInput?.name} 
                        value={createInput?.slug}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setcreateInput({
                            ...createInput,
                            slug: e.target.value
                          })
                        }}
                        style={{
                          margin: '10px',

                        }}
                        autoFocus
                        id="name"
                        label="Slug"
                        type="text"
                        fullWidth
                      />
                    </Box>

                    <Box flexBasis={'calc(33.33% - 10px)'}>
                      <TextField onChange={(event) => {
                        setcreateInput({
                          ...createInput,
                          imoji: event.target.value
                        })
                      }} value={createInput.imoji}
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
                    <Input.TextArea onChange={(event) => {
                      setcreateInput({
                        ...createInput,
                        description: event.target.value
                      })
                    }} placeholder='Task Description' style={{
                      margin: '10px',
                      width: '100%',
                      height: '200px'
                    }} />


                    <Box flexBasis={'calc(50.0% - 10px)'}>
                      <CreateTag tags={tags} setTags={setTags} />
                    </Box>
                    <Box flexBasis={'calc(50.0% - 10px)'}>
                      <FormControl style={{
                        marginTop: '5px'
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








                  </Box>
                  <Box m={1}>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>

                      <Typography mr={2}>Tips</Typography>
                      <Button onClick={() => settips([...tips, {
                        id: uniqueId(),
                        description: ''
                      }])}>Add</Button>
                    </Box>
                    {
                      tips.map((tip) => (
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                          <TextField value={tip.description} onChange={(event) => {
                            const newState = tips.map((data) => {
                              if (data.id === tip.id) {
                                return {
                                  ...data,
                                  description: event.target.value
                                }

                              } else {
                                return data
                              }
                            })
                            settips(newState)
                          }} placeholder='Tips description' style={{
                            margin: '10px',

                          }} fullWidth />
                          <Button onClick={() => {

                            const newState = tips.map(data => {
                              console.log(data.id);

                              if (tip.id === data.id) {
                                return null;
                              }

                              return data;
                            }).filter(item => item !== null);

                            settips(newState as {
                              id: string;
                              description: string;
                            }[])

                          }}>Delete</Button>
                        </Box>
                      ))
                    }
                  </Box>

                  <Box m={1}>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>

                      <Typography mr={2}>Prompts</Typography>
                      <Button onClick={() => setprompts([...prompts, {
                        id: uniqueId(),
                        name: '',
                        description: ''
                      }])}>Add</Button>
                    </Box>
                    {
                      prompts.map((prompt) => (
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>

                          <TextField value={prompt.name} onChange={(event) => {
                            const newState = prompts.map((data) => {
                              if (data.id === prompt.id) {
                                return {
                                  ...data,
                                  name: event.target.value
                                }

                              } else {
                                return data
                              }
                            })
                            setprompts(newState)
                          }} placeholder='Prompt Name' style={{
                            margin: '10px',

                          }} fullWidth />
                          <Input.TextArea value={prompt.description} onChange={(event) => {
                            const newState = prompts.map((data) => {
                              if (data.id === prompt.id) {
                                return {
                                  ...data,
                                  description: event.target.value
                                }

                              } else {
                                return data
                              }
                            })
                            setprompts(newState)
                          }} placeholder='Prompt Description' style={{
                            margin: '10px',
                            width: '100%',
                            height: '200px'
                          }} />

                          <Button onClick={() => {

                            const newState = prompts.map(data => {
                              console.log(data.id);

                              if (prompt.id === data.id) {
                                return null;
                              }

                              return data;
                            }).filter(item => item !== null);

                            setprompts(newState as {
                              id: string;
                              description: string;
                              name: string;
                            }[])

                          }}>Delete</Button>

                        </Box>
                      ))
                    }
                  </Box>


                </>

            }

          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>Cancel</Button>
            <Button onClick={taskId ? update : create}>{taskId ? 'Update' : 'Create'}</Button>
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
                    {data?.tasks.map((task) => {
                      return (
                        <TableRow hover key={task.id}>
                          <TableCell>
                            {task.imoji} {task.name}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2" fontWeight="500">
                              {task.category?.name}
                            </Typography>


                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {
                                task.tags.map((tag, index) => (
                                  <Chip style={{
                                    marginRight: '5px'
                                  }} label={tag} key={index} />
                                ))
                              }
                            </Typography>

                          </TableCell>

                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {task._count?.prompts}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="subtitle2">
                              {task._count?.tips}

                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Popconfirm onConfirm={() => deleteData(task.id)} title="Are you sure?">

                              <IconButton>
                                <IconTrash width={18} />
                              </IconButton>
                            </Popconfirm>
                            <IconButton onClick={() => handleClickOpen(task.id)}>
                              <IconEdit width={18} />
                            </IconButton>



                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>

                </Table>
              </TableContainer>
              <Box pb={2} mt={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>

                <Pagination current={skip + 1} onChange={(pageNumber) => {
                  setskip(pageNumber - 1)

                }} total={total?.aggregateTask._count?._all} pageSize={limit} />
              </Box>

            </BlankCard>
          </>

        </ParentCard>
      </PageContainer>
    </>

  );
};

export default Index;
