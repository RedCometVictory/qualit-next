import React, { useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const QuillEditor = ({value, name, onChange}) => {
  const quillRef = useRef(null);
  // const modules = {
  //   toolbar: [
  //     [{ header: [1,2,false] }],
  //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  //     [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  //     // ['link', 'image'],
  //     ['clean']
  //   ]
  // };
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      // ['link', 'image'],
      ['clean']
    ]
  };
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    // 'size'
  ];
  return (
    <div className="text-editor">
      <ReactQuill
        theme="snow"
        style={{ height: '120px' }}
        value={value}
        onChange={(content) => onChange({target: {name, value: content} })}
        modules={modules}
        formats={formats}
        ref={quillRef}
      ></ReactQuill>
    </div>
  )
};
export default QuillEditor;