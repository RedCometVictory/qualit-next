import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getTicket, editTicket } from "@/redux/features/project/projectSlice";
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
  // ability to read from a list of employees, select one PM (and multiple devs to be assigned to this project)
  // title, description (limit 360 characters), github_url, site_url, owner (auto created as the person who creates the project, via their own user id), created_at
  //TODO: slug should either say "project" or "ticket" to decide which is to be edited, instead if index.js this file should be named [id].js so the url reads "/edit/project-or-ticket/project-or-ticket-id"
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { ticket } = useSelector(state => state.project);
  let [formData, setFormData] = useState(ticket || initialTicketState || {});
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
  
  if (!hasMounted) return null;

  const dateChangeHandler = (newValue) => {
    setValue(newValue);
  };
  
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

  const textFieldHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }
    // return;
  };

  const submitTicketHandler = (e) => {
    e.preventDefault();
    console.log("submitting info for new project")
    setFormData(formData.owner = id);
    owner = id // use state may need to be let not const
    return console.log(formData);
    // dispatch(editTicket({formData, router}));
  };

  return (
    <section className="edit">
      <FormControl style={{width: '100%'}}>
        <div className="modal__ticket">
          <div className="modal__ticket--container">
            <PaperUI
              className="ticket-paper box"
            >
              <div className="sub-box one">
                <TextField
                  className='ticket-title'
                  variant="standard"
                  label="Ticket Title"
                />
                <TextareaAutosize
                  className='ticket-description'
                  maxRows={6}
                  minRows={3}
                  placeholder="Ticket description."
                />
              </div>
              <div className="sub-box two">
                <Upload />
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
                defaultValue="New"
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
                defaultValue="High"
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
                defaultValue="new"
                name="status-radio-buttons-group"
              >
                Type
              </FormLabel>
              <RadioGroup
                row
                defaultValue="Bug"
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
                value={value}
                onChange={dateChangeHandler}
                renderInput={(params) => <TextField {...params}/>}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="modal__actions">
          <ButtonUI
            variant="contained"
          >
            Submit
          </ButtonUI>
        </div>
      </FormControl>
    </section>
  )
};
export default EditTicket;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token;
    
    token ? token : null;
    console.log("token")
    console.log(token)
    if (!token) {
      console.log("session expired")
      context.res.setHeader(
        "Set-Cookie", [
          `qual__isLoggedIn=deleted; Max-Age=0`,
          // `qual__user=deleted; Max-Age=0` // in LS
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
        // data: "",
        // initGeneral: [],
        // initTrend: [],
        // initFollow: [],
      }
    }
  }
};
EditTicket.getLayout = function getLayout(EditTicket) {
  return <DetailLayout>{EditTicket}</DetailLayout>
};