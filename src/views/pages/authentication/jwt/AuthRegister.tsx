'use client';

// next
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { SyntheticEvent, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// types
import { StringColorProps } from 'types';

// ===========================|| JWT - REGISTER ||=========================== //

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Must be a valid email').max(255),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(10, 'Password must be less than 10 characters')
    .refine((value) => value === value.trim(), 'Password can not start or end with spaces')
});

type FormValues = z.infer<typeof schema>;

export default function JWTRegister({ ...others }) {
  const theme = useTheme();
  const router = useRouter();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState<StringColorProps>();
  const { register: registerUser } = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const searchParams = useSearchParams();
  const authParam = searchParams.get('auth');

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', firstName: '', lastName: '' }
  });

  const passwordField = register('password');

  const onSubmit = handleSubmit(async (values) => {
    try {
      const trimmedEmail = values.email.trim();
      await registerUser?.(trimmedEmail, values.password, values.firstName ?? '', values.lastName ?? '');
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Your registration has been successfully completed.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );

        setTimeout(() => {
          router.replace(authParam ? `/login?auth=${authParam}` : '/login');
        }, 1500);
      }
    } catch (err: any) {
      if (scriptedRef.current) {
        setError('root', { message: err.message });
      }
    }
  });

  return (
    <>
      <Grid container direction="column" spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }} size={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>
      <form noValidate onSubmit={onSubmit} {...others}>
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              type="text"
              {...register('firstName')}
              sx={{ ...theme.typography.customInput }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              type="text"
              {...register('lastName')}
              sx={{ ...theme.typography.customInput }}
            />
          </Grid>
        </Grid>
        <FormControl fullWidth error={Boolean(errors.email)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
          <OutlinedInput id="outlined-adornment-email-register" type="email" {...register('email')} />
          {errors.email && (
            <FormHelperText error id="standard-weight-helper-text--register">
              {errors.email.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth error={Boolean(errors.password)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-register"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...passwordField}
            onChange={(e) => {
              passwordField.onChange(e);
              changePassword(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && (
            <FormHelperText error id="standard-weight-helper-text-password-register">
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>

        {strength !== 0 && (
          <FormControl fullWidth>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid>
                  <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
                </Grid>
                <Grid>
                  <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                    {level?.label}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </FormControl>
        )}

        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
              label={
                <Typography variant="subtitle1">
                  Agree with &nbsp;
                  <Typography variant="subtitle1" component={Link} href="#">
                    Terms & Condition.
                  </Typography>
                </Typography>
              }
            />
          </Grid>
        </Grid>
        {errors.root && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>{errors.root.message}</FormHelperText>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
              Sign up
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
}
