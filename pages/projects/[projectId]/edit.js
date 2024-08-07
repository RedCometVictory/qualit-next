import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import store from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDataSSR } from "@/utils/fetchData";
import { getProject, updateProject, rehydrate } from "@/redux/features/project/projectSlice";
import { FormControl, TextareaAutosize, TextField, Typography } from "@mui/material";
import PaperUI from "@/components/UI/PaperUI";
import ButtonUI from "@/components/UI/ButtonUI";
import DetailLayout from "@/components/layouts/DetailLayout";

const initialProjectState = {title: "", description: "", github_url: "", site_url: "", owner: ""};

const EditProject = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { project } = useSelector(state => state.project);
  let [formData, setFormData] = useState(initialProjectState);
  const [hasMounted, setHasMounted] = useState(false);

  let { title, description, github_url, site_url, owner } = formData;
  
  useEffect(() => {
    dispatch(rehydrate(initialState.project))
  }, [dispatch, initialState]);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        github_url: project.github_url || "",
        site_url: project.site_url || ""
      })
    }
  }, [project]);
  
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
    const projectId = project.id;
    dispatch(updateProject({formData, projectId, router}));
  };

  return (
    <section className="form__container edit">
      <div className="form__header">
        <div className="form__info-box left">
          <Typography variant="h2">Edit Project Details</Typography>
          <div className="buttons">
            <Link
              href={`/my/projects`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                My Projects
              </ButtonUI>
            </Link>
            <Link
              href={`/projects/${project.id}`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                Project Detail
              </ButtonUI>
            </Link>
          </div>
        </div>
      </div>
      <div className="form__content">
        <PaperUI className="my-form">
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
      </div>
    </section>
  )
};
export default EditProject;
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

    let projectId = context.params.projectId;
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

    await store.dispatch(getProject({project_id: projectId, cookie: validCookieAuth}));

    return {
      props: {
        initialState: store.getState(),
        token,
        roleResult
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