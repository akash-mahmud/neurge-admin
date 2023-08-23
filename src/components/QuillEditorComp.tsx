// @ts-nocheck
import React, { useMemo, useRef, useState } from 'react'
import ReactQuill, {Quill} from 'react-quill'
import ImageResize from 'quill-image-resize-module-react'
import { UploadFileDocument, useUploadFileMutation } from '@/graphql/generated/schema';
import { getImage } from '@/utils/getimage';
import quillEmoji from "react-quill-emoji";


import "react-quill-emoji/dist/quill-emoji.css";
import { htmlEditButton } from "quill-html-edit-button";





import QuillBetterTable from "quill-better-table";
import { Spin } from 'antd';
import client from '@/apollo/client';
const ImageClipboard = Quill.import('modules/clipboard');
export default function QuillEditorComp({value , onChange:onChangeFunc}) {
    const [pasteLoading, setpasteLoading] = useState(false)
    const [uploadLoading, setuploadLoading] = useState(false)

    const quillRef = useRef();

    const imageHandler = () => {
        setuploadLoading(true)
        const input = document?.createElement("input");
    
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
    
        input.onchange = async () => {
          const file = input.files[0];
    
          let quillObj = quillRef.current.getEditor();
    
          // Save current cursor state
          const range = quillObj.getSelection();
    
         const {data} = await client.mutate({
            mutation:UploadFileDocument,
            variables:{
                file:file
            }
          });
    
          // Remove placeholder image
          quillObj.deleteText(range.index, 1);
    
          // Insert uploaded image
          quillObj.editor.insertEmbed(
            range.index,
            "image",
            getImage(data?.uploadFile?.file as string)
          );
          quillObj.setSelection(range.index + 1);
          // this.quill.insertEmbed(range.index, 'image', getImage(data?.SingleUpload?.imageLink));
    
          onChangeFunc(quillObj.root.innerHTML);
        };
        setuploadLoading(false)

      };

      Quill.register("modules/imageResize", ImageResize);
      class CustomClipboard extends ImageClipboard {
        async onPaste(event) {
          if (event.clipboardData && event.clipboardData.items && event.clipboardData.items.length) {
            const items = event.clipboardData.items;
            const imageItems = [];
      
            for (let item of items) {
              if (item.type.indexOf('image') !== -1) {
                imageItems.push(item);
              } else {
              }
            }
      
            if (imageItems.length > 0) {
              event.preventDefault();
      
              const quill = this.quill;
      
              const insertImages = async (imageItems) => {
                setpasteLoading(true);
      
                for (let item of imageItems) {
                  const file = item.getAsFile();
                  const imageUrl = await uploadImage(file);
                  if (imageUrl) {
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', imageUrl);
                    quill.setSelection(range.index + 1);
                  }
                }
      
                setpasteLoading(false);
              };
      
              insertImages(imageItems);
            } 
          }
      
          super.onPaste(event);
        }
    

      }
      Quill.register("modules/imageResize", ImageResize);
      Quill.register('modules/clipboard', CustomClipboard);
      const uploadImage = async (file) => {
        try {
            const {data} = await client.mutate({
                mutation:UploadFileDocument,
                variables:{
                    file:file
                }
              });
          
    
          return getImage(data?.uploadFile?.file);
        } catch (error) {
          console.error('Error uploading image:', error);
          return null;
        }
      };
      Quill.register(
        {
          "formats/emoji": quillEmoji.EmojiBlot,
          "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
        },
        true
      );
    
      Quill.register("modules/better-table", QuillBetterTable);
      Quill.register("modules/htmlEditButton", htmlEditButton);
      // Quill.register('modules/imageHandler', imageHandler)
      const PostCreatemodules = useMemo(
        () => ({
          toolbar: {
            // syntax: true,              // Include syntax module
    
            handlers: {
              image: imageHandler,
    
            },
          
            container: [
              // ['code-block'],
              ["bold", "italic"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
              ["link", "image", "video"],
              ["emoji"],
            ],
          },
          htmlEditButton: {
            syntax: true,
          },
    
          imageResize: {
            parchment: Quill.import("parchment"),
            modules: ["Resize", "DisplaySize"],
          },
          "emoji-toolbar": true,
          clipboard: {
            matchVisual: false,
          },
        }),
        []
      );

  return (
    <Spin spinning={pasteLoading||uploadLoading}>

        <ReactQuill               modules={PostCreatemodules}
        theme='snow'
        ref={quillRef} style={{
            height: 500
        }}
            value={value}
            onChange={onChangeFunc}
            placeholder="Description"
        />
    </Spin>
  )
}
