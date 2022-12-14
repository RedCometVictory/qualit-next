import { useEffect, useRef, useState } from  'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { registerUser } from '@/redux/features/auth/authSlice';
import MainLayout from "@/components/layouts/MainLayout";
import ButtonUI from '@/components/UI/ButtonUI';
import { Card, Input, InputLabel, FormGroup, CardContent, Typography } from "@mui/material";

/*
  email, firstname, lastname, username, password, password2, role by default is set to developer
*/
const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  password2: ""
};
  
const SignUp = () => {
  const effectRan = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [hasMounted, setHasMounted] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);

  const { firstName, lastName, username, email, password, password2 } = formData;

  useEffect(() => {
    // console.log('effectRan-01')
    // console.log(effectRan)
    // if (effectRan.current === true || process.env.NEXT_PUBLIC_NODE_ENV !== 'development') {
    //   console.log('effectRan-inner')
    //   console.log(effectRan)
      if (isAuthenticated) {
        router.push('/');
      }
    // };
    // return () => {
    //   console.log('unmounted')
    //   effectRan.current = true;
    //   console.log('effectRan-02')
    //   console.log(effectRan)

    // };
    
  }, [isAuthenticated]);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== password2) {
        toast.error('Passwords do not match.', {theme: 'colored', toastId: "noPasswordMatch"});
        return;
      }
      // toast.success("Submitted new registry.")
      dispatch(registerUser(formData));
    } catch (err) {
      console.error(err);
      toast.error("Failed to register. Check if email or password are valid.");
    }
  };

  return (
    <section className="login">
      <Card className="login__container signup">
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
                  maxLength={22}
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
                  maxLength={22}
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
            Already have an account?
            <ButtonUI
              href="/signin"
            >
              Sign In
            </ButtonUI>
          </div>
        </CardContent>
      </Card>
    </section>
  )
};
export default SignUp;
SignUp.getLayout = function getLayout(SignUp) {
  return <MainLayout>{SignUp}</MainLayout>
};


/*
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    console.log("no user in req ");
    return { props: {}, redirect: { destination: "/", permanent: false } };
  }

  return { props: { user } };
}


*/