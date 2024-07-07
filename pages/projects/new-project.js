import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { createProject } from "@/redux/features/project/projectSlice";
import { FormControl, InputLabel, TextareaAutosize, TextField, Typography } from "@mui/material";
import PaperUI from "@/components/UI/PaperUI";
import ButtonUI from "@/components/UI/ButtonUI";
import DetailLayout from "@/components/layouts/DetailLayout";

const initialState = {title: "", description: "", github_url: "", site_url: ""};

const NewProject = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const [formData, setFormData] = useState(initialState);
  const [hasMounted, setHasMounted] = useState(false);

  let { title, description, github_url, site_url } = formData;

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
    dispatch(createProject({formData, router}));
  };

  return (
    <section className="form__container">
    <div className="form__header">
      <div className="form__info-box">
        <Typography variant="h2">
          New Project
        </Typography>
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
export default NewProject;
NewProject.getLayout = function getLayout(NewProject) {
  return <DetailLayout>{NewProject}</DetailLayout>
};