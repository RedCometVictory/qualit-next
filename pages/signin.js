import Link from 'next/link';
import { useEffect, useState } from  'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import store from '@/redux/store';
import { toast } from 'react-toastify';
import { loginUser, logout, expiredTokenLogout, rehydrate } from '@/redux/features/auth/authSlice';
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
      </Card>
    </section>
  )
};
export default SignIn;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token || null;
    console.log("signin page -- token value")
    console.log(token)
    let { query } = context;
    let hasQueryParams = Object.keys(query).length > 0;
    if (hasQueryParams) {
      let { session_expired } = query;
      
      if (session_expired === 'true') {
        // context.res.setHeader(
        //   "Set-Cookie",
        //   [
        //     `qual__token=deleted; Max-Age=0; Expires=${new Date(0).toUTCString()}; Path=/; HttpOnly; Secure`,
        //     `qual__isLoggedIn=deleted; Max-Age=0; Expires=${new Date(0).toUTCString()}; Path=/; HttpOnly; Secure`
        //   ].join('; ')
        // );
        // context.res.setHeader(
        //   "Set-Cookie",
        //   [
        //     `qual__token=deleted; Max-Age=0; Path=/; HttpOnly; Secure`,
        //     `qual__isLoggedIn=deleted; Max-Age=0; Path=/; HttpOnly; Secure`
        //   ]
        // );

        await store.dispatch(expiredTokenLogout());
        // await store.dispatch(logout());
        
        context.res.setHeader(
          "Set-Cookie",
          // `qual__token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`
          `qual__token=deleted; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`
        );
        context.res.setHeader(
          "Set-Cookie",
          `qual__isLoggedIn=deleted; Max-Age=0; Path=/; HttpOnly; Secure`  
        );

        // let cookiesToDelete = [
        //   `qual__token=deleted; Max-Age=0; Path=/; HttpOnly; Secure`,
        //   `qual__isLoggedIn=deleted; Max-Age=0; Path=/; HttpOnly; Secure`
        // ];
        // context.res.setHeader("Set-Cookie", cookiesToDelete);

        // context.res.setHeader(
        //   "Set-Cookie",
        //   `qual__token=deleted; Max-Age=0; Expires=${new Date(0).toUTCString()}; Path=/; HttpOnly; Secure`
        // );
        // context.res.setHeader(
        //   "Set-Cookie",
        //   `qual__isLoggedIn=deleted; Max-Age=0; Expires=${new Date(0).toUTCString()}; Path=/; HttpOnly; Secure`  
        // );
      }

    };
    
    console.log("++++++++++++++++++++++++++++")
    console.log("this da query")
    console.log(query)
    console.log("++++++++++++++++++++++++++++")
    console.log("++++++++++++++++++++++++++++")
    /*
    res.setHeader(
    "Set-Cookie",
    [
      cookie.serialize("qual__token", '', {
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1,
        path: '/',
        httpOnly: true,
        expires: new Date(0)
      }),
      cookie.serialize("qual__isLoggedIn", '', {
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1,
        path: '/',
        httpOnly: true,
        expires: new Date(0)
      }),
      
    ]
    // cookie.serialize("ual__token", null, { expires: new Date(1), maxAge: 0, path: '/', httpOnly: false })
  );
    */
    // if (token && Object.keys(query).length === 0) {
    if (token) {
      console.log("00000000000000000000")
      console.log("00000000000000000000")
      console.log("token")
      console.log(token)
      console.log("00000000000000000000")
      console.log("00000000000000000000")
      // token = JSON.stringify(token);
      // context.res.setHeader(
      //   "Set-Cookie", [
      //     `qual__isLoggedIn=deleted; Max-Age=-1; Expires: new Date(0)`,
      //     // `qual__isLoggedIn=deleted; Max-Age=0; Expires: new Date(0)`,
      //     // `qual__isLoggedIn=deleted; Max-Age=0`,
      //     // `qual__user=deleted; Max-Age=0`
      //   ]
      // )
      // await store.dispatch(logout());
      return {
        redirect: {
          initialState: store.getState(),
          destination: `/`,
          permanent: false,
        },
        props: {},
      };
    };
    
    // let userInfo = context.req.cookies.qual__user;
    // let ticketID = context.params.ticketId;
    // let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    // let userRole = await getDataSSR(`/auth/checkAuth`, validCookieAuth);
    // let roleResult = userRole?.data?.role;

    // await store.dispatch(getTicket({ticket_id: ticketID, cookie: validCookieAuth}));

    return {
      props: {
        initialState: store.getState(),
        // token,
        // roleResult
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