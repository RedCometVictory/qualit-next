import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import store from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getProjectAndUserAssignments, updateProject, rehydrate } from "@/redux/features/project/projectSlice";
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

const initialProjectState = {title: "", description: "", github_url: "", site_url: "", owner: ""};

const EditProject = ({initialState, token}) => {
  // ability to read from a list of employees, select one PM (and multiple devs to be assigned to this project)
  // title, description (limit 360 characters), github_url, site_url, owner (auto created as the person who creates the project, via their own user id), created_at
  //TODO: slug should either say "project" or "ticket" to decide which is to be edited, instead if index.js this file should be named [id].js so the url reads "/edit/project-or-ticket/project-or-ticket-id"
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { project } = useSelector(state => state.project);
  let [formData, setFormData] = useState(project || initialProjectState || {});
  const [hasMounted, setHasMounted] = useState(false);

  let { title, description, github_url, site_url, owner } = formData;
  
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
  
  if (!hasMounted) {
    return null;
  };

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  
  const textFieldHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }
    // return;
  };

  const submitProjectHandler = (e) => {
    e.preventDefault();
    console.log("submitting info for new project")
    setFormData(formData.owner = id);
    owner = id // use state may need to be let not const
    return console.log(formData);
    // dispatch(editProject({formData, router}));
  };

  return (
    <section className="form__container edit">
      <Typography
        className="form__header" 
        variant="body1"
      >
        <Typography className="form__heading" variant="h3">
          Edit Project & Assign Members
        </Typography>
      </Typography>
      <PaperUI
        className="form__content my-form"
      >
        <form onSubmit={submitProjectHandler} className="form create-form">
          <FormControl
            className="form-control"
            sx={{ m: 1, minWidth: 120 }}
            size='small'
          >
            <Typography variant="body1" className="form__group set one">
              <TextField
                className="search-input"
                type="text"
                label="Title"
                name="title"
                value={title}
                onChange={e => onChange(e)}
                onKeyDown={e => textFieldHandler(e)}
                size="small"
                id="outlined-search-label"
                required
              />
              <PaperUI
                className="description-box box"
              >
                <TextareaAutosize
                  className="project-description"
                  minRows={3}
                  maxRows={18}
                  maxLength={720}
                  placeholder="Add project description."
                  name="description"
                  value={description}
                  onChange={e => onChange(e)}
                  required
                />
              </PaperUI>
            </Typography>
            <Typography variant="body1" className="form__group set two">
              <TextField
                className="search-input"
                type="text"
                label="Github Url"
                name="github_url"
                value={github_url}
                onChange={e => onChange(e)}
                onKeyDown={e => textFieldHandler(e)}
                size="small"
                id="outlined-search-label"
              />
              <TextField
                className="search-input"
                type="text"
                label="Website Url"
                name="site_url"
                value={site_url}
                onChange={e => onChange(e)}
                onKeyDown={e => textFieldHandler(e)}
                size="small"
                id="outlined-search-label"
              />
            </Typography>
            <Typography variant="body1" className="form_group submit-btn">
              <ButtonUI
                variant='contained'
                size="small"
                type="submit"
              >
                Submit
              </ButtonUI>
            </Typography>
          </FormControl>
        </form>
      </PaperUI>
    </section>
  )
};
export default EditProject;
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

    let projectId = context.params.projectId;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    await store.dispatch(getProject({project_id: projectId, cookie: validCookieAuth}));

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
EditProject.getLayout = function getLayout(EditProject) {
  return <DetailLayout>{EditProject}</DetailLayout>
};