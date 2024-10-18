import { AppBar, Container, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingTop: '80px', paddingBottom: 5 }}>
      {/* AppBar for navigation */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', 
          width: '100%', 
          top: 0, 
          left: 0, 
          mb: 4, 
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold', 
              letterSpacing: '0.05em', 
              color: '#fff', 
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              userSelect: 'none' 
            }}
          >
            Flashcard SaaS
          </Typography>

          <Button sx={{ 
            px: 3, py: 1.2, borderRadius: '25px', 
            transition: 'all 0.3s', 
            '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' } 
          }}>
            <Link href="/sign-in" passHref>
              <Typography 
                variant="button" 
                sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', textTransform: 'none' }}
              >
                Login
              </Typography>
            </Link>
          </Button>
          
          <Button sx={{ 
            px: 3, py: 1.2, borderRadius: '25px', 
            transition: 'all 0.3s', 
            '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' } 
          }}>
            <Link href="/sign-up" passHref>
              <Typography 
                variant="button" 
                sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', textTransform: 'none' }}
              >
                Sign Up
              </Typography>
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      {/* SignUp form */}
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
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Container>
  );
}
