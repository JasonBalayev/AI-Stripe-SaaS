import { AppBar, Container, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingBottom: 5 }}>
      {/* AppBar for navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#800080', mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.05em' }}>
            Flashcard SaaS
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              <Typography variant="button" sx={{ fontSize: '1rem', fontWeight: 'bold', textTransform: 'none', color: '#fff' }}>
                Login
              </Typography>
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              <Typography variant="button" sx={{ fontSize: '1rem', fontWeight: 'bold', textTransform: 'none', color: '#fff' }}>
                Sign Up
              </Typography>
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      {/* SignIn form */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
          Sign In
        </Typography>
        <SignIn />
      </Box>
    </Container>
  );
}
