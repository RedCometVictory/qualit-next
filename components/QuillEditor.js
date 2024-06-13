import React from 'react';
import 'react-quill/dist/quill.snow.css';
// const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const QuillEditor = ({value, onChange}) => {
  const modules = {
    toolbar: [
      [{ header: [1,2,false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
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
    'image'
  ];
  return (
    <div className="text-editor">
      <ReactQuill
        theme="snow"
        style={{ height: '120px' }}
        value={value}
        onChange={value => onChange(value)}
        modules={modules}
        formats={formats}
      ></ReactQuill>
    </div>
  )
};
export default QuillEditor;