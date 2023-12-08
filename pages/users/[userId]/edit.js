import React from 'react'
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import store from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDataSSR } from '@/utils/fetchData';
import { logout } from "@/redux/features/auth/authSlice";
import { getUserProfile, updateUserProfile, rehydrate } from "@/redux/features/user/userSlice";
import { Divider, FormControl, FormControlLabel, FormLabel, InputLabel, Radio, RadioGroup, TextareaAutosize, TextField, Typography } from "@mui/material";
import PaperUI from "@/components/UI/PaperUI";
import ButtonUI from "@/components/UI/ButtonUI";
import DetailLayout from "@/components/layouts/DetailLayout";

const initialProjectState = {f_name: "", l_name: "", username: "", email: "", role: ""};

const EditUserAccount = ({initialState, token, roleResult}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.user);
  // let { detail } = user;
  let [formData, setFormData] = useState(initialProjectState);
  const [hasMounted, setHasMounted] = useState(false);

  let { f_name, l_name, username, email, role } = formData;
  
  // useEffect(() => {
  //   if (!token || !Cookies.get("qual__isLoggedIn")) {
  //     dispatch(logout());
  //     toast.success("Token or authorization expired.")
  //     return router.push("/");
  //   }
  // }, []);

  useEffect(() => {
    dispatch(rehydrate(initialState.user))
  }, [dispatch, initialState]);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        f_name: user?.detail?.f_name || "",
        l_name: user?.detail?.l_name || "",
        username: user?.detail?.username || "",
        email: user?.detail?.email || "",
        role: user?.detail?.role || ""
      })
    }
  }, [user]);
  
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

  const submitProfileUpdateHandler = (e) => {
    e.preventDefault();
    const userId = user?.detail?.id;
    console.log("submitting info for user profile update")
    console.log(formData);
    // return console.log(formData);
    dispatch(updateUserProfile({formData, userId, router}));
  };

  return (
    <section className="form__container edit">
      <div className="form__header">
        <div className="form__info-box left">
          <Typography variant="h2">Edit User Details</Typography>
          <div className="buttons">
            {roleResult === "Admin" ? (
              <Link
                href={`/users`}
                passHref
              >
                <ButtonUI
                  className="btn-one"
                  variant="contained"
                  color="primary"
                >
                  User List
                </ButtonUI>
              </Link>
            ) : (null)}
            <Link
              href={`/my/account`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                My Account
              </ButtonUI>
            </Link>
          </div>
        </div>
      </div>
      <div className="form__content">
        <PaperUI className="my-form">
          <form onSubmit={submitProfileUpdateHandler} className="form create-form">
            <FormControl
              className="form-control"
              sx={{ m: 1, minWidth: 120 }}
              size='small'
            >
              <Typography variant="body1" className="form__group set one">
                <TextField
                  className="search-input"
                  type="text"
                  label="First Name"
                  name="f_name"
                  value={f_name}
                  onChange={e => onChange(e)}
                  onKeyDown={e => textFieldHandler(e)}
                  size="small"
                  id="outlined-search-label"
                  required
                />
                <TextField
                  className="search-input"
                  type="text"
                  label="Last Name"
                  name="l_name"
                  value={l_name}
                  onChange={e => onChange(e)}
                  onKeyDown={e => textFieldHandler(e)}
                  size="small"
                  id="outlined-search-label"
                  required
                />
                
                {roleResult === "Admin" ? (<>
                  <Divider />
                  <div className="modal__radio-group priority">
                    <FormLabel
                      aria-label="status-radio-buttons-group"
                      defaultValue="new"
                      name="status-radio-buttons-group"
                    >
                      User Role
                    </FormLabel>
                    <RadioGroup
                      row
                      // defaultValue="High"
                      name="role"
                      value={role}
                      // defaultValue={priority}


                      // label="Github Url"
                      onChange={e => onChange(e)}
                      // onKeyDown={e => textFieldHandler(e)}
                      // size="small"
                      // id="outlined-search-label"
                    >
                      <FormControlLabel value="Developer" control={<Radio />} label="Developer"/>
                      <FormControlLabel value="Project Manager" control={<Radio />} label="Project Manager"/>
                      <FormControlLabel value="Admin" control={<Radio />} label="Administrator"/>
                      <FormControlLabel value="Banned" control={<Radio />} label="Banned"/>
                      <FormControlLabel value="Deleted" control={<Radio />} label="Deleted"/>
                    </RadioGroup>
                  </div>
                  <Divider />
                </>) : (null)}


                {/* <PaperUI
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
                </PaperUI> */}
              </Typography>
              <Typography variant="body1" className="form__group set two">
                <TextField
                  className="search-input"
                  type="text"
                  label="Username"
                  name="username"
                  value={username}
                  onChange={e => onChange(e)}
                  onKeyDown={e => textFieldHandler(e)}
                  size="small"
                  id="outlined-search-label"
                />
                <TextField
                  className="search-input"
                  type="email"
                  label="E-mail"
                  name="email"
                  value={email}
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
export default EditUserAccount;
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

    let userId = context.params.userId;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    await store.dispatch(getUserProfile({user_id: userId, cookie: validCookieAuth}));
    let userRole = await getDataSSR(`/auth/checkAuth`, validCookieAuth);
    let roleResult = userRole?.data?.role;

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
      }
    }
  }
};
EditUserAccount.getLayout = function getLayout(EditUserAccount) {
  return <DetailLayout>{EditUserAccount}</DetailLayout>
};