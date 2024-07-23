import Link from 'next/link';
import { useEffect, useState } from  'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import store from '@/redux/store';
import { toast } from 'react-toastify';
import { loginUser, demoUser, expiredTokenLogout, rehydrate } from '@/redux/features/auth/authSlice';
import MainLayout from "@/components/layouts/MainLayout";
import ButtonUI from '@/components/UI/ButtonUI';
import { Card, Input, InputLabel, FormGroup, CardContent, Typography } from "@mui/material";

const initialSignInState = {email: "", password: ""};

const cssThemesList = ['vector', 'paper', 'cross', 'circles', 'zigzag3d', 'wavy'];
const cssSelectedTheme = () => {
  const randomIndex = Math.floor(Math.random() * cssThemesList.length);
  return cssThemesList[randomIndex];
};
const SignIn = ({initialState}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState(initialSignInState);
  const [theme, setTheme] = useState('');
  const { isAuthenticated } = useSelector(state => state.auth);

  const { email, password } = formData;

  useEffect(() => {
    if (!Cookies.get("qual__isLoggedIn")) {
      localStorage.removeItem('qual__user');
    }

    const selectTheme = cssSelectedTheme();
    setTheme(selectTheme);
  }, []);

  useEffect(() => {
    dispatch(rehydrate(initialState.project))
  }, [dispatch, initialState]);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) return null;

  if (router?.query?.session_expired) {
    toast?.error("Session expired. Please login.", { toastId: "expiredAuthId" });
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginUser({formData, router}));
    } catch (err) {
      console.error(err);
      toast?.error("Failed to register. Check if email or password are valid.", {toastId: "signinErr"});
    }
  };

  const runDemoHandler = () => {
    dispatch(demoUser(router));
  };

  return (
    <section className={`login login__background--${theme}`}>
      <Card
        className="login__container"
        sx={{ boxShadow: `0px 6px 15px -4px rgba(0,0,0,0.7)`, borderRadius: `16px` }}
      >
        <CardContent>
          <Typography
            variant='h4'
            component="div"
          >
            Sign In
          </Typography>
        </CardContent>
        <form
          className="login__form"
          onSubmit={submitHandler}
        >
          <FormGroup>
            <CardContent className="login__card">
              <div className="login__form-group">
                <InputLabel className="login__label" sx={{ color: `var(--body-text)` }}>
                  E-Mail
                </InputLabel>
                <Input
                  className="login__input"
                  id='outlined-basic'
                  type='email'
                  placeholder='my1@email.com'
                  name='email'
                  label='Outlined'
                  variant='outlined'
                  value={email}
                  maxLength={60}
                  onChange={onChange}
                  sx={{ color: `var(--body-text)` }}
                  required
                />
              </div>
              <div className="login__form-group">
                <InputLabel className="login__label" sx={{ color: `var(--body-text)` }}>
                  Password
                </InputLabel>
                <Input
                  className="login__input"
                  id='outlined-basic'
                  type='password'
                  name='password'
                  label='Outlined'
                  variant='outlined'
                  value={password}
                  maxLength={60}
                  onChange={onChange}
                  sx={{ color: `var(--body-text)` }}
                  required
                />
              </div>
            </CardContent>
            <div className="login__submit-btn">
              <ButtonUI
                className='main-login-btn'
                type='submit'
                variant='contained'
              >
                Sign In
              </ButtonUI>
            </div>
          </FormGroup>
        </form>
        <CardContent>
          <div className="login__footer">
            Don&apos;t have an account?{" "}
            <Link
              // passHref
              href="/signup"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
        <CardContent>
          <div className="">
            Run Demo Account? {" "}
            <ButtonUI className="" variant="" onClick={() => runDemoHandler()}>
              Try Demo
            </ButtonUI>
          </div>
        </CardContent>
      </Card>
    </section>
  )
};
export default SignIn;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token || null;
    let { query } = context;
    let hasQueryParams = Object.keys(query).length > 0;
    if (hasQueryParams) {
      let { session_expired } = query;
      
      if (session_expired === 'true') {
        await store.dispatch(expiredTokenLogout());
        
        context.res.setHeader(
          "Set-Cookie",
          // `qual__token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`
          `qual__token=deleted; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`
        );
        context.res.setHeader(
          "Set-Cookie",
          `qual__isLoggedIn=deleted; Max-Age=0; Path=/; HttpOnly; Secure`  
        );
      }

    };
    // if (token && Object.keys(query).length === 0) {
    if (token) {
      return {
        redirect: {
          initialState: store.getState(),
          destination: `/`,
          permanent: false,
        },
        props: {},
      };
    };

    return {
      props: {
        initialState: store.getState()
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
SignIn.getLayout = function getLayout(SignIn) {
  return <MainLayout>{SignIn}</MainLayout>
};