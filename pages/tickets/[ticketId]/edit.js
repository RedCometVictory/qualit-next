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

/* project
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(360) NOT NULL,
  description TEXT NOT NULL,
  github_url TEXT,
  site_url TEXT,
  -- owner is admin / submitter (user_id)
  owner UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
*/

/* users - for assigning to tickets and listing them for availability
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  f_name VARCHAR(60) NOT NULL,
  l_name VARCHAR(60) NOT NULL,
  username VARCHAR(120) NOT NULL UNIQUE,
  email VARCHAR(60) NOT NULL UNIQUE,
  password VARCHAR(660) NOT NULL,
  -- ['Admin', 'Developer', 'Submitter', 'Project Manager', 'Banned', 'Deleted']
  role VARCHAR(120) NOT NULL DEFAULT 'Developer',
  -- user_avatar VARCHAR(300),
  -- user_avatar_filename VARCHAR(600),
  -- refresh_token TEXT,
  -- treat status as 'active' or 'deleted' if false
  -- status BOOLEAN DEFAULT true NOT NULL,
  -- may not need project_id for this table as members relation between users and projects table would offer more sense in structure
  project_id UUID,
  FOREIGN KEY(project_id) REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
*/

/* members - assure assigned users are members of project
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- active BOOLEAN DEFAULT true NOT NULL,
  -- ['assigned','reassigned','removed']
  status VARCHAR(120),
  user_id UUID,
  project_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(project_id) REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
*/

/* ticket
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(120),
  description TEXT,
  notes TEXT,
  -- ['New','Open','On Hold','In Progress','Closed','Unconfirmed']
  status VARCHAR(100) NOT NULL DEFAULT 'New',
  -- ['Urgent','High','Medium','Low','None']
  priority VARCHAR(100) NOT NULL,
  -- ['Bug','Breaking Change','Discussion','Error','Enhancement','Feature Request','Needs Investigation','Question','Release','Regression','Security','Misc']
  type VARCHAR(100) NOT NULL,
  -- user id of submitter
  submitter UUID,
  deadline TIMESTAMP DEFAULT NULL,
  -- id of user ticket is assigned to
  user_id UUID,
  project_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(project_id) REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
*/

const initialTicketState = {title: "", description: "", notes: [], status: "", priority: "", type: "", submitter: "", deadline: ""};
/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */
const EditTicket = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { ticket } = useSelector(state => state.project);
  let [formData, setFormData] = useState(initialTicketState);
  const [value, setValue] = useState(dayjs("2023-08-12T21:11:54"));
  const [hasMounted, setHasMounted] = useState(false);

  let {title, description, notes, status, priority, type, submitter, deadline} = formData;

  useEffect(() => {
    if (!token || !Cookies.get("qual__isLoggedIn")) {
      dispatch(logout());
      toast.success("Token or authorization expired.")
      return router.push("/");
    }
  }, []);
  
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

  // const dateChangeHandler = (newValue) => {
  //   setValue(newValue);
  // };
  const dateChangeHandler = (newValue) => {
    setFormData(formData = {...formData, deadline: newValue.$d.toISOString()});
    console.log(formData);
  };
  
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  // console.log(formData);
  
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
    // console.log("submitting info for new project")
    // setFormData(formData.owner = id);
    // owner = id // use state may need to be let not const
    // return console.log(formData);
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
                        // label="Ticket Title"


                        // className="search-input"
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
                        // maxRows={6}
                        // minRows={3}
                        // placeholder="Ticket description."

                        // className="project-description"
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
                      // value={value}
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
    let token = context.req.cookies.qual__token;
    token ? token : null;
    if (!token) {
      console.log("session expired")
      context.res.setHeader(
        "Set-Cookie", [
          `qual__isLoggedIn=deleted; Max-Age=0`,
          // `qual__userRole=deleted; Max-Age=0`,
        ]
      )
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
    console.log("attempting redirect edit ticket")
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