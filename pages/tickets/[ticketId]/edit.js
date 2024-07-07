import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import store from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getDataSSR } from "@/utils/fetchData";
import { logout } from "@/redux/features/auth/authSlice";
import { getTicket, updateTicket, rehydrate } from "@/redux/features/project/projectSlice";
import { Divider, FormControl, FormControlLabel, FormLabel, InputLabel, Radio, RadioGroup, TextareaAutosize, TextField, Typography } from "@mui/material";
import PaperUI from "@/components/UI/PaperUI";
import ButtonUI from "@/components/UI/ButtonUI";
import Upload from "@/components/details/Upload";
import DetailLayout from "@/components/layouts/DetailLayout";

const initialTicketState = {title: "", description: "", notes: [], status: "", priority: "", type: "", submitter: "", deadline: ""};

const EditTicket = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { ticket } = useSelector(state => state.project);
  let [formData, setFormData] = useState(initialTicketState);
  const [value, setValue] = useState(dayjs("2023-08-12T21:11:54"));
  const [hasMounted, setHasMounted] = useState(false);

  let {title, description, notes, status, priority, type, submitter, deadline} = formData;

  // useEffect(() => {
  //   if (!token || !Cookies.get("qual__isLoggedIn")) {
  //     dispatch(logout());
  //     toast.success("Token or authorization expired.")
  //     return router.push("/");
  //   }
  // }, []);
  
  useEffect(() => {
    dispatch(rehydrate(initialState.project))
  }, [dispatch, initialState])
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        status: ticket.status || "",
        priority: ticket.priority || "",
        type: ticket.type || "",
        deadline: ticket.deadline || ""
      })
    }
  }, [ticket]);
  
  if (!hasMounted) return null;

  const dateChangeHandler = (newValue) => {
    setFormData(formData = {...formData, deadline: newValue.$d.toISOString()});
    console.log(formData);
  };
  
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  
  const textFieldHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }
    // return;
  };

  const submitEditTicketHandler = (e) => {
    e.preventDefault();
    const ticketId = ticket.id;
    dispatch(updateTicket({formData, ticketId, router}));
  };

  return (
    <section className="form__container edit">
      <div className="form__header">
        <div className="form__info-box left">
          <Typography variant="h2">Edit Ticket Details</Typography>
          <div className="buttons">
            <Link
              href={`/my/tickets`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                My Tickets
              </ButtonUI>
            </Link>
            <Link
              href={`/tickets/${ticket.id}`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                Ticket Detail
              </ButtonUI>
            </Link>
          </div>
        </div>
      </div>
      <div className="form__content">
        <PaperUI className="my-form">
          <form onSubmit={submitEditTicketHandler} className="form create-form">
            <FormControl
              className="form-control"
              sx={{ m: 1, minWidth: 120 }}
              size='small'
            >
              <div className="modal__ticket">
                <div className="modal__ticket--container">
                  <PaperUI className="ticket-paper box">
                    <div className="sub-box one">
                      <TextField
                        className='ticket-title'
                        variant="standard"
                        type="text"
                        label="Title"
                        name="title"
                        value={title}
                        onChange={e => onChange(e)}
                        onKeyDown={e => textFieldHandler(e)}
                        size='small'
                        id="outlined-search-label"
                        required
                      />
                      <TextareaAutosize
                        className='ticket-description'
                        minRows={3}
                        maxRows={18}
                        maxLength={720}
                        placeholder="Add ticket description."
                        name="description"
                        value={description}
                        onChange={e => onChange(e)}
                        required
                      />
                    </div>
                  </PaperUI>
                </div>
                <div className="modal__radio-selects">
                  <div className="modal__radio-group status">
                    <FormLabel
                      aria-label="status-radio-buttons-group"
                      defaultValue="new"
                      name="status-radio-buttons-group"
                    >
                      Status
                    </FormLabel>
                    <RadioGroup
                      row
                      name="status"
                      value={status}
                      // defaultValue={status}
                      // defaultValue="New"
                      // label="Github Url"
                      onChange={e => onChange(e)}
                      // onKeyDown={e => textFieldHandler(e)}
                      // size="small"
                      // id="outlined-search-label"
                    >
                      <FormControlLabel value="New" control={<Radio />} label="New"/>
                      <FormControlLabel value="Open" control={<Radio />} label="Open"/>
                      <FormControlLabel value="On Hold" control={<Radio />} label="On Hold"/>
                      <FormControlLabel value="In Progress" control={<Radio />} label="In Progress"/>
                      <FormControlLabel value="Closed" control={<Radio />} label="Closed"/>
                      <FormControlLabel value="Unconfirmed" control={<Radio />} label="Unconfirmed"/>
                    </RadioGroup>
                  </div>
                  <Divider />
                  <div className="modal__radio-group priority">
                    <FormLabel
                      aria-label="status-radio-buttons-group"
                      defaultValue="new"
                      name="status-radio-buttons-group"
                    >
                      Priority
                    </FormLabel>
                    <RadioGroup
                      row
                      // defaultValue="High"
                      name="priority"
                      value={priority}
                      // defaultValue={priority}
                      // label="Github Url"
                      onChange={e => onChange(e)}
                      // onKeyDown={e => textFieldHandler(e)}
                      // size="small"
                      // id="outlined-search-label"
                    >
                      <FormControlLabel value="Urgent" control={<Radio />} label="Urgent"/>
                      <FormControlLabel value="High" control={<Radio />} label="High"/>
                      <FormControlLabel value="Medium" control={<Radio />} label="Medium"/>
                      <FormControlLabel value="Low" control={<Radio />} label="Low"/>
                      <FormControlLabel value="None" control={<Radio />} label="None"/>
                    </RadioGroup>
                  </div>
                  <Divider />
                  <div className="modal__radio-group type">
                    <FormLabel
                      aria-label="status-radio-buttons-group"
                      // defaultValue="new"
                      name="status-radio-buttons-group"
                    >
                      Type
                    </FormLabel>
                    <RadioGroup
                      row
                      // defaultValue="Bug"
                      name="type"
                      value={type}
                      // defaultValue={type}
                      // label="Github Url"
                      onChange={e => onChange(e)}
                      // onKeyDown={e => textFieldHandler(e)}
                      // size="small"
                      // id="outlined-search-label"
                    >
                      <FormControlLabel value="Bug" control={<Radio />} label="Bug"/>
                      <FormControlLabel value="Breaking Change" control={<Radio />} label="Breaking Change"/>
                      <FormControlLabel value="Discussion" control={<Radio />} label="Discussion"/>
                      <FormControlLabel value="Error" control={<Radio />} label="Error"/>
                      <FormControlLabel value="Enhancement" control={<Radio />} label="Enhancement"/>
                      <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request"/>
                      <FormControlLabel value="Needs Investigation" control={<Radio />} label="Needs Investigation"/>
                      <FormControlLabel value="Question" control={<Radio />} label="Question"/>
                      <FormControlLabel value="Release" control={<Radio />} label="Release"/>
                      <FormControlLabel value="Regression" control={<Radio />} label="Regression"/>
                      <FormControlLabel value="Security" control={<Radio />} label="Security"/>
                      <FormControlLabel value="Misc" control={<Radio />} label="Misc"/>
                    </RadioGroup>
                  </div>
                </div>
                <Divider />
                <div className="modal__date-picker">
                  <h4 className="date-picker-header">Date Deadline (Optional):</h4>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Date Deadline"
                      inputFormat="MM/DD/YYYY"
                      name='deadline'
                      value={deadline}
                      onChange={dateChangeHandler}
                      renderInput={(params) => <TextField {...params}/>}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="modal__actions">
                <ButtonUI
                  variant="contained"
                  type="submit"
                  sx={{ color: 'primary.text' }}
                >
                  Submit
                </ButtonUI>
              </div>
            </FormControl>
          </form>
        </PaperUI>
      </div>
    </section>
  );
};
export default EditTicket;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token || null;
    if (!token) {
      return {
        redirect: {
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };

    let ticketId = context.params.ticketId;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    let userRole = await getDataSSR(`/auth/checkAuth`, validCookieAuth);
    let roleResult = userRole?.data?.role;

    if (roleResult === "Developer" || !roleResult) {
      return {
        redirect: {
          destination: `/403`,
          permanent: false
        },
        props: {}
      };
    };

    await store.dispatch(getTicket({ticket_id: ticketId, cookie: validCookieAuth}));

    return {
      props: {
        initialState: store.getState(),
        token
      }
    }
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      },
      props: {
        token: ""
      }
    }
  }
};
EditTicket.getLayout = function getLayout(EditTicket) {
  return <DetailLayout>{EditTicket}</DetailLayout>
};