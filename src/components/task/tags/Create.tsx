import React, {  Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Tag, theme } from 'antd';
import  TweenOneGroup  from 'rc-tween-one/lib/TweenOneGroup';
import { AddTaskOutlined, Close } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';

const CreateTag: React.FC<{
  tags:  string[]
  setTags: Dispatch<SetStateAction<string[]>>
}> = ({ tags, setTags}) => {
  const { token } = theme.useToken();

  const [inputVisible, setInputVisible] = useState(true);
  const [inputValue, setInputValue] = useState('');




  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {


    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);
tagChild.push((<Tag onClick={showInput} style={{
    cursor:'pointer'
}}
    
    >
          + More
 </Tag>))


  return (
    <>
    
      {inputVisible ?(
        <TextField autoFocus={inputVisible}
          type="text" placeholder='Tags'
          value={inputValue}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" style={{
                cursor: 'pointer'
          
              }}
              >
                <span onClick={handleInputConfirm}> <AddTaskOutlined /></span>
                <span onClick={()=>     setInputVisible(false)
}>  <Close/></span>
              
             
              </InputAdornment>
            ),
          
          }}
        //   onPressEnter={handleInputConfirm}
          fullWidth
        
        />
      ) : (
       
        <div >
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: 'from',
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === 'appear' || e.type === 'enter') {
              (e.target as any).style = 'display: inline-block';
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
        
      </div>
      )}
    </>
  );
};

export default CreateTag;