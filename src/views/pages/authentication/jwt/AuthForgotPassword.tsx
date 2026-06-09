'use client';

// next
import { useRouter, useSearchParams } from 'next/navigation';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// third party
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// ========================|| JWT - FORGOT PASSWORD ||======================== //

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid email').max(255)
});

type FormValues = z.infer<typeof schema>;

export default function AuthForgotPassword({ link, ...others }: { link?: string }) {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn, resetPassword } = useAuth();

  const searchParams = useSearchParams();
  const authParam = searchParams.get('auth');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' }
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetPassword?.(values.email).then(
        () => {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Check mail for reset password link',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
          setTimeout(() => {
            router.replace(
              isLoggedIn ? `/pages/check-mail/${link || 'check-mail3'}` : authParam ? `/check-mail?auth=${authParam}` : '/check-mail'
            );
          }, 1500);
        },
        (err: any) => {
          setError('root', { message: err.message });
        }
      );
    } catch (err: any) {
      console.error(err);
      if (scriptedRef.current) {
        setError('root', { message: err.message });
      }
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} {...others}>
      <FormControl fullWidth error={Boolean(errors.email)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-forgot">Email Address / Username</InputLabel>
        <OutlinedInput id="outlined-adornment-email-forgot" type="email" {...register('email')} label="Email Address / Username" />
        {errors.email && (
          <FormHelperText error id="standard-weight-helper-text-email-forgot">
            {errors.email.message}
          </FormHelperText>
        )}
      </FormControl>

      {errors.root && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{errors.root.message}</FormHelperText>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
            Send Mail
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
