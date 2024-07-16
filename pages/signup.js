import Link from 'next/link';
import { useEffect, useState } from  'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { registerUser, demoUser } from '@/redux/features/auth/authSlice';
import MainLayout from "@/components/layouts/MainLayout";
import ButtonUI from '@/components/UI/ButtonUI';
import { Card, Input, InputLabel, FormGroup, CardContent, Typography } from "@mui/material";

const initialState = {
  firstName: "", lastName: "", username: "", email: "", password: "", password2: ""
};

const cssThemesList = ['vector', 'paper', 'cross', 'circles', 'zigzag3d', 'wavy'];
const cssSelectedTheme = () => {
  const randomIndex = Math.floor(Math.random() * cssThemesList.length);
  return cssThemesList[randomIndex];
};
const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [hasMounted, setHasMounted] = useState(false);
  const [theme, setTheme] = useState('');
  const { isAuthenticated } = useSelector(state => state.auth);

  const { firstName, lastName, username, email, password, password2 } = formData;

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     console.log("redirecting signup")
  //     router.push('/');
  //   }
  // }, [router, isAuthenticated]);

  useEffect(() => {
    setHasMounted(true);
    const selectTheme = cssSelectedTheme();
    setTheme(selectTheme);
  }, []);
  
  if (!hasMounted) return null;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== password2) {
        toast?.error('Passwords do not match.', {theme: 'colored', toastId: "noPasswordMatch"});
        return;
      }
      dispatch(registerUser(formData));
    } catch (err) {
      toast?.error("Failed to register. Check if email or password are valid.");
    }
  };

  const runDemoHandler = () => {
    dispatch(demoUser(router));
  };

  return (
    <section className={`login login__background--${theme}`}>
      <Card
        className="login__container signup"
        sx={{ boxShadow: `0px 6px 15px -4px rgba(0,0,0,0.7)`, borderRadius: `16px` }}
      >
        <CardContent>
          <Typography
            variant='h4'
            component="div"
          >
            Sign Up
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
                  First Name
                </InputLabel>
                <Input
                  className="login__input"
                  id='outlined-basic'
                  type='text'
                  placeholder='Jane'
                  name='firstName'
                  label='Outlined'
                  variant='outlined'
                  value={firstName}
                  maxLength={12}
                  onChange={onChange}
                  sx={{ color: `var(--body-text)` }}
                  required
                />
              </div>
              <div className="login__form-group">
                <InputLabel className="login__label" sx={{ color: `var(--body-text)` }}>
                  Last Name
                </InputLabel>
                <Input
                  className="login__input"
                  id='outlined-basic'
                  type='text'
                  placeholder='Doe'
                  name='lastName'
                  label='Outlined'
                  variant='outlined'
                  value={lastName}
                  maxLength={22}
                  onChange={onChange}
                  sx={{ color: `var(--body-text)` }}
                  required
                />
              </div>
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
                  Username
                </InputLabel>
                <Input
                  className="login__input"
                  id='outlined-basic'
                  type='text'
                  placeholder='myUser1name'
                  name='username'
                  label='Outlined'
                  variant='outlined'
                  value={username}
                  maxLength={20}
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
              <div className="login__form-group">
                <InputLabel className="login__label" sx={{ color: `var(--body-text)` }}>
                  Re-Type Password
                </InputLabel>
                <Input
                  className="login__input"
                  id='outlined-basic'
                  type='password'
                  name='password2'
                  label='Outlined'
                  variant='outlined'
                  value={password2}
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
                Sign Up
              </ButtonUI>
            </div>
          </FormGroup>
        </form>
        <CardContent>
          <div className="login__footer">
            Already have an account?{" "}
            <Link
            // passHref
              href="/signin"
            >
              Sign In
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
export default SignUp;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token || null;
    if (token) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
        props: {}
      };
    };
    return {
      props: {}
    };
  } catch (err) {
    console.log(err);
    return {
      destination: "/signin",
      permanent: false,
      props: {
        token: ""
      }
    };
  }
};
SignUp.getLayout = function getLayout(SignUp) {
  return <MainLayout>{SignUp}</MainLayout>
};