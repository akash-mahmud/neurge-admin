import { Upload } from 'antd'
import { RcFile,  UploadFile } from 'antd/es/upload'
import React, { memo } from 'react'
interface IPropType{
  beforeUpload: (args: RcFile )=> Promise<void>
    uploadButton: JSX.Element
    filelist: UploadFile<any>[]
    handlePreview?: ((file: UploadFile<any>) => void) | undefined
handleRemove: ((file: UploadFile<any>) => boolean | void | Promise<boolean | void>) | undefined
}
function UploadSingleImage({beforeUpload , uploadButton ,filelist, handlePreview , handleRemove}:IPropType) {
  return (

                     <Upload multiple={false} maxCount={1}

                     beforeUpload={(args) => beforeUpload(args)}
                     onRemove={handleRemove}
                       listType="picture-card"
                       fileList={filelist}
                       onPreview={handlePreview}
                     >
                       {filelist.length >= 8 ? null : uploadButton}
                     </Upload>
  )
}

export default memo(UploadSingleImage)
