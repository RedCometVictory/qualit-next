import { useEffect, useState } from  'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { loginUser } from '@/redux/features/auth/authSlice';
import MainLayout from "@/components/layouts/MainLayout";
import ButtonUI from '@/components/UI/ButtonUI';
import { Card, Input, InputLabel, FormGroup, CardContent, Typography } from "@mui/material";

/*
  email, firstname, lastname, username, password, password2, role by default is set to developer
*/
const initialState = {
  email: "",
  password: ""
};
  
const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { isAuthenticated } = useSelector(state => state.auth);

  const { email, password } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
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
     
      dispatch(loginUser(formData));
      toast.success("Logged in successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to register. Check if email or password are valid.");
    }
  };

  return (
    <section className="login">
      <Card className="login__container">
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
            Already have an account?
            <ButtonUI
              href="/signup"
            >
              Sign Up
            </ButtonUI>
          </div>
        </CardContent>
      </Card>
    </section>
  )
};
export default SignIn;
SignIn.getLayout = function getLayout(SignIn) {
  return <MainLayout>{SignIn}</MainLayout>
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