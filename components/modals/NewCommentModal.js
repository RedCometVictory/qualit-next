import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useRouter } from 'next/router';
import { FaFileUpload } from "react-icons/fa";
import { createTicketComment } from '@/redux/features/project/projectSlice';
// import { createUpdateTicketCommentForm } from '@/utils/formDataServices';
import CommentForm from "../details/CommentForm";
import PaperUI from '../UI/PaperUI';
import ButtonUI from "../UI/ButtonUI";
import { TextareaAutosize } from "@mui/material";

// const NewCommentModal = ({setCommentModal, ticketID}) => {
const NewCommentModal = ({setCommentModal}) => {
  let router = useRouter();
  // console.log("_+_+_+_+_+_+_+_+_+_+_")
  // console.log("router params")
  // console.log(router)
  let ticketID = router.query.ticketId;
  // console.log("ticket id")
  // console.log(ticketID)
  // console.log("_+_+_+_+_+_+_+_+_+_+_")

  const dispatch = useDispatch();
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [showImageData, isShowImageData] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    upload: ""
  });

  const { message, upload } = formData;

  // useEffect(() => {
  //   if (!token || !Cookies.get("blog__isLoggedIn")) {
  //     dispatch({type: "LOGOUT"});
  //     logoutUser();
  //     return router.push("/");
  //   }
  //   setIsLoading(false);
  // }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadChange = (e) => {
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    checkFileSize(fileToUpload);

    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
    // * set up image preview, if valid
    if (fileToUpload) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageData(reader.result)
        isShowImageData(true);
      });
      reader.readAsDataURL(fileToUpload);
    }
  };

  // TODO: add check for pdf
  const checkFileType = (img) => {
    const types = ["image/png", "image/jpg", "image/jpeg", "image/gif", "application/pdf"];
    if (types.every((type) => img.type !== type)) {
      return setFileTypeError(true);
    }
    return setFileTypeError(false);
  };

  const checkFileSize = (img) => {
    let size = 3 * 1024 * 1024; // size limit 3mb
    if (img.size > size) {
      return setFileSizeError(true);
    }
    return setFileSizeError(false);
  };

  const closeModalHandler = () => {
    setCommentModal(false);
  };

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    // const formData = {id: user.id, message: message};
    // const formData = message;
    // let servicedData = await createUpdateTicketCommentForm(formData);
    // let servicedData = createUpdateTicketCommentForm(formData);
    console.log("(((formData)))")
    console.log(formData);
    // formData.message = JSON.stringify(formData.message);    
    // await dispatch(createTicketComment({ticket_id: ticketID, formData: formData}));
    // await dispatch(createTicketComment({ticket_id: ticketID, servicedData}));
    console.log("+{{{{{{{{{}}}}}}}}}+")
    console.log("++++ticketID++++");
    console.log(ticketID);
    await dispatch(createTicketComment({ticket_id: ticketID, formData}));
    // setMessage(message = '')
    // setFormData({message: "", upload: ""});
    setSubmitted(false);
    setCommentModal(false);
  };

  return (
    <PaperUI
      className="modal comment"
    >
      <div className="modal__header">
        <h3 className="title">
          New Comment
        </h3>
      </div>
      <div className="modal__content comment">
        <form onSubmit={submitCommentHandler}>
          <TextareaAutosize
            className='text-area'
            maxRows={6}
            minRows={6}
            placeholder="Add new comment."
            name="message"
            value={message}
            onChange={onChange}
            required
          />
          <div className="modal__actions comment">
            <div className="file-uploader">
              <div className='label-title'><FaFileUpload /> Upload File</div>
              <label htmlFor="upload" className="file-upload-label">
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif, .pdf"
                  placeholder=".jpeg, .jpg, .png, .gif, .pdf formats only"
                  name="upload"
                  onChange={handleUploadChange}
                />
              </label>
            </div>
            <div className="action-btns">
              {fileTypeError || fileSizeError ? (
                <div className="form__error">
                  File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
                </div>
              ) : (
                <ButtonUI
                  variant="contained"
                  // onClick={(e) => submitCommentHandler(e)}
                  type="submit"
                >
                  {isSubmitted ? "Submitted" : "Submit"}
                </ButtonUI>
              )}
              <ButtonUI
                variant="outlined"
                // sx={{ color: 'primary.contrastText' }}
                sx={{ color: 'primary.main' }}
                onClick={() => closeModalHandler()}
              >
                Cancel
              </ButtonUI>
            </div>
          </div>
        </form>
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  )
};
export default NewCommentModal;

// ========================================
// ======== ORIGINAL MODAL EXAMPLE ========
// ========================================
/*
return (
    <div className="modal comment">
      <div className="modal__header">
        <h3 className="title">
          New Comment
        </h3>
      </div>
      <div className="modal__content comment">
        <form onSubmit={submitCommentHandler}>
          <TextareaAutosize
            className='text-area'
            maxRows={6}
            minRows={6}
            placeholder="Add new comment."
            name="message"
            value={message}
            onChange={onChange}
            required
          />
          <div className="modal__actions comment">
            <div className="file-uploader">
              <div className='label-title'><FaFileUpload /> Upload File</div>
              <label htmlFor="upload" className="file-upload-label">
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif, .pdf"
                  placeholder=".jpeg, .jpg, .png, .gif, .pdf formats only"
                  name="upload"
                  onChange={handleUploadChange}
                />
              </label>
            </div>
            <div className="action-btns">
              {fileTypeError || fileSizeError ? (
                <div className="form__error">
                  File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
                </div>
              ) : (
                <ButtonUI
                  variant="contained"
                  // onClick={(e) => submitCommentHandler(e)}
                  type="submit"
                >
                  {isSubmitted ? "Submitted" : "Submit"}
                </ButtonUI>
              )}
              <ButtonUI
                variant="outlined"
                // sx={{ color: 'primary.contrastText' }}
                sx={{ color: 'primary.main' }}
                onClick={() => closeModalHandler()}
              >
                Cancel
              </ButtonUI>
            </div>
          </div>
        </form>
      </div>
      <div className="modal__footer"></div>
    </div>
  )
*/
// ========================================
// ========================================
// ========================================

// ##############################
// ##############################
// this is the redux state after successfule comment is created
// TODO: need to re-work to object layering, at least strip one layer of the object out, should be layered like:
/* TODO: [
  {
    id: ,
    message:, 
    created_on: ,
    upload: {
      id: ,
      file_url,
      created_on
    }
  },
]
*/
/*
{ 
  project: {
    comments: [
      0: {
        "comment": {
          "comment": {
            "id": "7be64bf2-edc9-4044-95bd-0473ce088f9e",
            "message": "another comment",
            "notes": null,
            "user_id": "18fd6896-3761-4669-9b29-3b0fed2f27eb",
            "ticket_id": "d01f3576-e368-4ea1-b27f-4349956a7210",
            "created_at": "2022-12-30T01:43:05.291Z",
            "updated_at": null
          },
          "upload": {
            "id": "cac7688e-dfcb-4c9a-baf0-d960c3ce5f6e",
            "file_url": "",
            "file_name": "",
            "message_id": "7be64bf2-edc9-4044-95bd-0473ce088f9e",
            "created_at": "2022-12-30T01:43:05.304Z"
          }
        }
      }
    ]
  }
}
*/

// ##############################
// ##############################





//  IncomingMessage {
//   _readableState: ReadableState {
//     objectMode: false,
//     highWaterMark: 16384,
//     buffer: BufferList { head: null, tail: null, length: 0 },
//     length: 0,
//     pipes: [],
//     flowing: null,
//     ended: true,
//     endEmitted: false,
//     reading: false,
//     sync: true,
//     needReadable: false,
//     emittedReadable: false,
//     readableListening: false,
//     resumeScheduled: false,
//     errorEmitted: false,
//     emitClose: true,
//     autoDestroy: false,
//     destroyed: false,
//     errored: null,
//     closed: false,
//     closeEmitted: false,
//     defaultEncoding: 'utf8',
//     awaitDrainWriters: null,
//     multiAwaitDrain: false,
//     readingMore: true,
//     decoder: null,
//     encoding: null,
//     [Symbol(kPaused)]: null
//   },
//   _events: [Object: null prototype] {
//     end: [ [Function: clearRequestTimeout], [Function (anonymous)] ],
//     error: [Function (anonymous)]
//   },
//   _eventsCount: 2,
//   _maxListeners: undefined,
//   socket: <ref *1> Socket {
//     connecting: false,
//     _hadError: false,
//     _parent: null,
//     _host: null,
//     _readableState: ReadableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       buffer: BufferList { head: null, tail: null, length: 0 },
//       length: 0,
//       pipes: [],
//       flowing: true,
//       ended: false,
//       endEmitted: false,
//       reading: true,
//       sync: false,
//       needReadable: true,
//       emittedReadable: false,
//       readableListening: false,
//       resumeScheduled: false,
//       errorEmitted: false,
//       emitClose: false,
//       autoDestroy: false,
//       destroyed: false,
//       errored: null,
//       closed: false,
//       closeEmitted: false,
//       defaultEncoding: 'utf8',
//       awaitDrainWriters: null,
//       multiAwaitDrain: false,
//       readingMore: false,
//       decoder: null,
//       encoding: null,
//       [Symbol(kPaused)]: false
//     },
//     _events: [Object: null prototype] {
//       end: [Array],
//       timeout: [Function: socketOnTimeout],
//       data: [Function: bound socketOnData],
//       error: [Function: socketOnError],
//       close: [Array],
//       drain: [Function: bound socketOnDrain],
//       resume: [Function: onSocketResume],
//       pause: [Function: onSocketPause]
//     },
//     _eventsCount: 8,
//     _maxListeners: undefined,
//     _writableState: WritableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       finalCalled: false,
//       needDrain: false,
//       ending: false,
//       ended: false,
//       finished: false,
//       destroyed: false,
//       decodeStrings: false,
//       defaultEncoding: 'utf8',
//       length: 0,
//       writing: false,
//       corked: 0,
//       sync: true,
//       bufferProcessing: false,
//       onwrite: [Function: bound onwrite],
//       writecb: null,
//       writelen: 0,
//       afterWriteTickInfo: null,
//       buffered: [],
//       bufferedIndex: 0,
//       allBuffers: true,
//       allNoop: true,
//       pendingcb: 0,
//       prefinished: false,
//       errorEmitted: false,
//       emitClose: false,
//       autoDestroy: false,
//       errored: null,
//       closed: false,
//       closeEmitted: false
//     },
//     allowHalfOpen: true,
//     _sockname: null,
//     _pendingData: null,
//     _pendingEncoding: '',
//     server: Server {
//       maxHeaderSize: undefined,
//       insecureHTTPParser: undefined,
//       _events: [Object: null prototype],
//       _eventsCount: 5,
//       _maxListeners: undefined,
//       _connections: 2,
//       _handle: [TCP],
//       _usingWorkers: false,
//       _workers: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 0,
//       keepAliveTimeout: 5000,
//       maxHeadersCount: null,
//       headersTimeout: 60000,
//       requestTimeout: 0,
//       _connectionKey: '6::::3000',
//       [Symbol(IncomingMessage)]: [Function: IncomingMessage],
//       [Symbol(ServerResponse)]: [Function: ServerResponse],
//       [Symbol(kCapture)]: false,
//       [Symbol(async_id_symbol)]: 7
//     },
//     _server: Server {
//       maxHeaderSize: undefined,
//       insecureHTTPParser: undefined,
//       _events: [Object: null prototype],
//       _eventsCount: 5,
//       _maxListeners: undefined,
//       _connections: 2,
//       _handle: [TCP],
//       _usingWorkers: false,
//       _workers: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 0,
//       keepAliveTimeout: 5000,
//       maxHeadersCount: null,
//       headersTimeout: 60000,
//       requestTimeout: 0,
//       _connectionKey: '6::::3000',
//       [Symbol(IncomingMessage)]: [Function: IncomingMessage],
//       [Symbol(ServerResponse)]: [Function: ServerResponse],
//       [Symbol(kCapture)]: false,
//       [Symbol(async_id_symbol)]: 7
//     },
//     parser: HTTPParser {
//       '0': [Function: bound setRequestTimeout],
//       '1': [Function: parserOnHeaders],
//       '2': [Function: parserOnHeadersComplete],
//       '3': [Function: parserOnBody],
//       '4': [Function: parserOnMessageComplete],
//       '5': [Function: bound onParserExecute],
//       '6': [Function: bound onParserTimeout],
//       _headers: [],
//       _url: '',
//       socket: [Circular *1],
//       incoming: [Circular *2],
//       outgoing: null,
//       maxHeaderPairs: 2000,
//       _consumed: true,
//       onIncoming: [Function: bound parserOnIncoming],
//       [Symbol(resource_symbol)]: [HTTPServerAsyncResource]
//     },
//     on: [Function: socketListenerWrap],
//     addListener: [Function: socketListenerWrap],
//     prependListener: [Function: socketListenerWrap],
//     _paused: false,
//     _httpMessage: ServerResponse {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       outputData: [],
//       outputSize: 0,
//       writable: true,
//       destroyed: false,
//       _last: false,
//       chunkedEncoding: false,
//       shouldKeepAlive: true,
//       _defaultKeepAlive: true,
//       useChunkedEncodingByDefault: true,
//       sendDate: true,
//       _removedConnection: false,
//       _removedContLen: false,
//       _removedTE: false,
//       _contentLength: null,
//       _hasBody: true,
//       _trailer: '',
//       finished: false,
//       _headerSent: false,
//       socket: [Circular *1],
//       _header: null,
//       _keepAliveTimeout: 5000,
//       _onPendingData: [Function: bound updateOutgoingData],
//       _sent100: false,
//       _expect_continue: false,
//       statusCode: 200,
//       flush: [Function: flush],
//       write: [Function: write],
//       end: [Function: end],
//       on: [Function: on],
//       writeHead: [Function: writeHead],
//       [Symbol(kCapture)]: false,
//       [Symbol(kNeedDrain)]: false,
//       [Symbol(corked)]: 0,
//       [Symbol(kOutHeaders)]: [Object: null prototype]
//     },
//     [Symbol(async_id_symbol)]: 450308,
//     [Symbol(kHandle)]: TCP {
//       reading: true,
//       onconnection: null,
//       _consumed: true,
//       [Symbol(owner_symbol)]: [Circular *1]
//     },
//     [Symbol(kSetNoDelay)]: false,
//     [Symbol(lastWriteQueueSize)]: 0,
//     [Symbol(timeout)]: null,
//     [Symbol(kBuffer)]: null,
//     [Symbol(kBufferCb)]: null,
//     [Symbol(kBufferGen)]: null,
//     [Symbol(kCapture)]: false,
//     [Symbol(kBytesRead)]: 0,
//     [Symbol(kBytesWritten)]: 0,
//     [Symbol(RequestTimeout)]: undefined
//   },
//   httpVersionMajor: 1,
//   httpVersionMinor: 1,
//   httpVersion: '1.1',
//   complete: true,
//   headers: {
//     host: 'localhost:3000',
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/2010
// 0101 Firefox/91.0',
//     accept: '*/*',
//     'accept-language': 'en-US,en;q=0.5',
//     'accept-encoding': 'gzip, deflate',
//     referer: 'http://localhost:3000/projects/3622cdf0-458a-442b-b37c-e4ceb5924bc
// 4',
//     'x-nextjs-data': '1',
//     connection: 'keep-alive',
//     cookie: '__stripe_mid=deb3bf0d-e876-4f27-ac63-c7f1381674f94d187b; blog__user
// Info=null; qual__isLoggedIn=true',
//     'sec-fetch-dest': 'empty',
//     'sec-fetch-mode': 'cors',
//     'sec-fetch-site': 'same-origin'
//   },
//   rawHeaders: [
//     'Host',
//     'localhost:3000',
//     'User-Agent',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/9
// 1.0',
//     'Accept',
//     '*/*',
//     'Accept-Language',
//     'en-US,en;q=0.5',
//     'Accept-Encoding',
//     'gzip, deflate',
//     'Referer',
//     'http://localhost:3000/projects/3622cdf0-458a-442b-b37c-e4ceb5924bc4',
//     'x-nextjs-data',
//     '1',
//     'Connection',
//     'keep-alive',
//     'Cookie',
//     '__stripe_mid=deb3bf0d-e876-4f27-ac63-c7f1381674f94d187b; blog__userInfo=nul
// l; qual__isLoggedIn=true',
//     'Sec-Fetch-Dest',
//     'empty',
//     'Sec-Fetch-Mode',
//     'cors',
//     'Sec-Fetch-Site',
//     'same-origin'
//   ],
//   trailers: {},
//   rawTrailers: [],
//   aborted: false,
//   upgrade: false,
//   url: '/_next/data/development/projects/3622cdf0-458a-442b-b37c-e4ceb5924bc4.js
// on?projectId=3622cdf0-458a-442b-b37c-e4ceb5924bc4',
//   method: 'GET',
//   statusCode: null,
//   statusMessage: null,
//   client: <ref *1> Socket {
//     connecting: false,
//     _hadError: false,
//     _parent: null,
//     _host: null,
//     _readableState: ReadableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       buffer: BufferList { head: null, tail: null, length: 0 },
//       length: 0,
//       pipes: [],
//       flowing: true,
//       ended: false,
//       endEmitted: false,
//       reading: true,
//       sync: false,
//       needReadable: true,
//       emittedReadable: false,
//       readableListening: false,
//       resumeScheduled: false,
//       errorEmitted: false,
//       emitClose: false,
//       autoDestroy: false,
//       destroyed: false,
//       errored: null,
//       closed: false,
//       closeEmitted: false,
//       defaultEncoding: 'utf8',
//       awaitDrainWriters: null,
//       multiAwaitDrain: false,
//       readingMore: false,
//       decoder: null,
//       encoding: null,
//       [Symbol(kPaused)]: false
//     },
//     _events: [Object: null prototype] {
//       end: [Array],
//       timeout: [Function: socketOnTimeout],
//       data: [Function: bound socketOnData],
//       error: [Function: socketOnError],
//       close: [Array],
//       drain: [Function: bound socketOnDrain],
//       resume: [Function: onSocketResume],
//       pause: [Function: onSocketPause]
//     },
//     _eventsCount: 8,
//     _maxListeners: undefined,
//     _writableState: WritableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       finalCalled: false,
//       needDrain: false,
//       ending: false,
//       ended: false,
//       finished: false,
//       destroyed: false,
//       decodeStrings: false,
//       defaultEncoding: 'utf8',
//       length: 0,
//       writing: false,
//       corked: 0,
//       sync: true,
//       bufferProcessing: false,
//       onwrite: [Function: bound onwrite],
//       writecb: null,
//       writelen: 0,
//       afterWriteTickInfo: null,
//       buffered: [],
//       bufferedIndex: 0,
//       allBuffers: true,
//       allNoop: true,
//       pendingcb: 0,
//       prefinished: false,
//       errorEmitted: false,
//       emitClose: false,
//       autoDestroy: false,
//       errored: null,
//       closed: false,
//       closeEmitted: false
//     },
//     allowHalfOpen: true,
//     _sockname: null,
//     _pendingData: null,
//     _pendingEncoding: '',
//     server: Server {
//       maxHeaderSize: undefined,
//       insecureHTTPParser: undefined,
//       _events: [Object: null prototype],
//       _eventsCount: 5,
//       _maxListeners: undefined,
//       _connections: 2,
//       _handle: [TCP],
//       _usingWorkers: false,
//       _workers: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 0,
//       keepAliveTimeout: 5000,
//       maxHeadersCount: null,
//       headersTimeout: 60000,
//       requestTimeout: 0,
//       _connectionKey: '6::::3000',
//       [Symbol(IncomingMessage)]: [Function: IncomingMessage],
//       [Symbol(ServerResponse)]: [Function: ServerResponse],
//       [Symbol(kCapture)]: false,
//       [Symbol(async_id_symbol)]: 7
//     },
//     _server: Server {
//       maxHeaderSize: undefined,
//       insecureHTTPParser: undefined,
//       _events: [Object: null prototype],
//       _eventsCount: 5,
//       _maxListeners: undefined,
//       _connections: 2,
//       _handle: [TCP],
//       _usingWorkers: false,
//       _workers: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 0,
//       keepAliveTimeout: 5000,
//       maxHeadersCount: null,
//       headersTimeout: 60000,
//       requestTimeout: 0,
//       _connectionKey: '6::::3000',
//       [Symbol(IncomingMessage)]: [Function: IncomingMessage],
//       [Symbol(ServerResponse)]: [Function: ServerResponse],
//       [Symbol(kCapture)]: false,
//       [Symbol(async_id_symbol)]: 7
//     },
//     parser: HTTPParser {
//       '0': [Function: bound setRequestTimeout],
//       '1': [Function: parserOnHeaders],
//       '2': [Function: parserOnHeadersComplete],
//       '3': [Function: parserOnBody],
//       '4': [Function: parserOnMessageComplete],
//       '5': [Function: bound onParserExecute],
//       '6': [Function: bound onParserTimeout],
//       _headers: [],
//       _url: '',
//       socket: [Circular *1],
//       incoming: [Circular *2],
//       outgoing: null,
//       maxHeaderPairs: 2000,
//       _consumed: true,
//       onIncoming: [Function: bound parserOnIncoming],
//       [Symbol(resource_symbol)]: [HTTPServerAsyncResource]
//     },
//     on: [Function: socketListenerWrap],
//     addListener: [Function: socketListenerWrap],
//     prependListener: [Function: socketListenerWrap],
//     _paused: false,
//     _httpMessage: ServerResponse {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       outputData: [],
//       outputSize: 0,
//       writable: true,
//       destroyed: false,
//       _last: false,
//       chunkedEncoding: false,
//       shouldKeepAlive: true,
//       _defaultKeepAlive: true,
//       useChunkedEncodingByDefault: true,
//       sendDate: true,
//       _removedConnection: false,
//       _removedContLen: false,
//       _removedTE: false,
//       _contentLength: null,
//       _hasBody: true,
//       _trailer: '',
//       finished: false,
//       _headerSent: false,
//       socket: [Circular *1],
//       _header: null,
//       _keepAliveTimeout: 5000,
//       _onPendingData: [Function: bound updateOutgoingData],
//       _sent100: false,
//       _expect_continue: false,
//       statusCode: 200,
//       flush: [Function: flush],
//       write: [Function: write],
//       end: [Function: end],
//       on: [Function: on],
//       writeHead: [Function: writeHead],
//       [Symbol(kCapture)]: false,
//       [Symbol(kNeedDrain)]: false,
//       [Symbol(corked)]: 0,
//       [Symbol(kOutHeaders)]: [Object: null prototype]
//     },
//     [Symbol(async_id_symbol)]: 450308,
//     [Symbol(kHandle)]: TCP {
//       reading: true,
//       onconnection: null,
//       _consumed: true,
//       [Symbol(owner_symbol)]: [Circular *1]
//     },
//     [Symbol(kSetNoDelay)]: false,
//     [Symbol(lastWriteQueueSize)]: 0,
//     [Symbol(timeout)]: null,
//     [Symbol(kBuffer)]: null,
//     [Symbol(kBufferCb)]: null,
//     [Symbol(kBufferGen)]: null,
//     [Symbol(kCapture)]: false,
//     [Symbol(kBytesRead)]: 0,
//     [Symbol(kBytesWritten)]: 0,
//     [Symbol(RequestTimeout)]: undefined
//   },
//   _consuming: false,
//   _dumped: false,
//   cookies: {
//     __stripe_mid: 'deb3bf0d-e876-4f27-ac63-c7f1381674f94d187b',
//     blog__userInfo: 'null',
//     qual__isLoggedIn: 'true'
//   },
//   [Symbol(kCapture)]: false,
//   [Symbol(RequestTimeout)]: undefined,
//   [Symbol(NextRequestMeta)]: {
//     __NEXT_INIT_URL: 'http://localhost:3000/_next/data/development/projects/3622
// cdf0-458a-442b-b37c-e4ceb5924bc4.json?projectId=3622cdf0-458a-442b-b37c-e4ceb592
// 4bc4',
//     __NEXT_INIT_QUERY: { projectId: '3622cdf0-458a-442b-b37c-e4ceb5924bc4' },
//     _protocol: 'http',
//     __NEXT_CLONABLE_BODY: {
//       finalize: [AsyncFunction: finalize],
//       cloneBodyStream: [Function: cloneBodyStream]
//     },
//     __nextHadTrailingSlash: false,
//     __nextIsLocaleDomain: false
//   }
// }
