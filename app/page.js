'use client'

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid, Snackbar, Alert } from '@mui/material';
import Head from "next/head";
import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; 

export default function Home() {
  const { isLoaded, userId } = useAuth(); 
  const [error, setError] = useState(''); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const router = useRouter(); 

  const handleSubmit = async (plan) => {
    if (!isLoaded) {
      return;
    }

    if (!userId) {
      setError('You must be logged in to purchase a plan.');
      setOpenSnackbar(true);
      return;
    }

    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan, 
      }),
    });

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return 
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
    if (error) {
      console.warn(error.message)
    }
  }

  const handleGetStarted = () => {
    if (!isLoaded) {
      return;
    }

    if (!userId) {
      setError('You must be logged in to get started.');
      setOpenSnackbar(true);
      return;
    }

    router.push('/generate');
  }

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingTop: '80px', paddingBottom: 5 }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      {/* Enhanced AppBar / Navigation Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', 
          width: '100%', 
          top: 0, 
          left: 0, 
          mb: 4, 
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
          zIndex: 1100 
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold', 
              letterSpacing: '0.05em', 
              color: '#fff', 
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', 
              userSelect: 'none'
            }}
          >
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Login Button */}
              <Button 
                sx={{ 
                  px: 3, 
                  py: 1.2, 
                  borderRadius: '25px', 
                  backgroundColor: 'transparent', 
                  color: '#fff',
                  transition: 'all 0.3s', 
                  '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' } 
                }}
                onClick={() => router.push('/sign-in')}
              >
                <Typography 
                  variant="button" 
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', textTransform: 'none' }}
                >
                  Login
                </Typography>
              </Button>
              {/* Sign Up Button */}
              <Button 
                sx={{ 
                  px: 3, 
                  py: 1.2, 
                  borderRadius: '25px', 
                  backgroundColor: 'transparent', 
                  color: '#fff',
                  transition: 'all 0.3s', 
                  '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' } 
                }}
                onClick={() => router.push('/sign-up')}
              >
                <Typography 
                  variant="button" 
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', textTransform: 'none' }}
                >
                  Sign Up
                </Typography>
              </Button>
            </Box>
          </SignedOut>
          <SignedIn>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                sx={{ 
                  px: 3, 
                  py: 1.2, 
                  borderRadius: '25px', 
                  transition: 'all 0.3s', 
                  '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' }, 
                  marginRight: 2,
                  color: '#fff'
                }}
                onClick={() => router.push('/flashcards')}
              >
                <Typography 
                  variant="button" 
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', textTransform: 'none' }}
                >
                  Saved Collections
                </Typography>
              </Button>
              <UserButton />
            </Box>
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Welcome Section */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Unlock Your Learning Potential with Flashcard SaaS
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#666' }}>
          Effortlessly create flashcards from your own study material using our AI-powered platform.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: 'grey', fontStyle: 'italic' }}>
          *Currently in Beta - All paid features are in test mode!*
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            mt: 2, px: 4, py: 1.5, borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold',
            background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
            color: '#fff',
            transition: 'all 0.3s',
            '&:hover': { transform: 'scale(1.05)', background: '#5e35b1' }
          }}
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="left" sx={{ fontWeight: 'bold', color: '#333' }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#6a11cb', fontWeight: 'bold' }}>
              Simple Input Interface
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Paste your notes or type directly. Our AI handles the rest, transforming your material into effective flashcards.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#6a11cb', fontWeight: 'bold' }}>
              Intelligent Flashcard Generation
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Leveraging advanced AI, we create concise and relevant flashcards to enhance your learning experience.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#6a11cb', fontWeight: 'bold' }}>
              Study Anytime, Anywhere
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Access your flashcards across all devices. Study on the go with ease and flexibility.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
          Choose the plan that fits your needs. Upgrade anytime as you grow.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 4,
              border: '2px solid',  // Increased border width
              borderColor: '#6a11cb',  // Purple outline
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#6a11cb' }}>
                Basic Plan
              </Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography sx={{ color: '#666', minHeight: '60px' }}>
                Get started with essential features and limited storage.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: '30px',
                  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                  color: '#fff',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'scale(1.05)', background: '#5e35b1' }
                }}
                onClick={() => handleSubmit('basic')}
              >
                Choose Basic
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 4,
              border: '2px solid',  // Increased border width
              borderColor: '#6a11cb',  // Purple outline
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#6a11cb' }}>
                Pro Plan
              </Typography>
              <Typography variant="h6" gutterBottom>$10 / month</Typography>
              <Typography sx={{ color: '#666', minHeight: '60px' }}>
                Unlock unlimited flashcards and priority support.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: '30px',
                  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                  color: '#fff',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'scale(1.05)', background: '#5e35b1' }
                }}
                onClick={() => handleSubmit('pro')}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ color: 'grey', mt: 4, fontStyle: 'italic' }}>
          *My platform is a work in progress. New features coming soon!*
        </Typography>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
