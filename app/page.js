'use client'

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import Head from "next/head";


export default function Home() {

  const handleSubmit = async (plan) => {
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
      const {error} = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      })
      if (error) {
        console.warn(error.message)
      }
  }
  return (
    // Main container for the entire page
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vx', paddingBottom: 5 }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      {/* Header / Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.05em' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button 
              color="inherit" href="/sign-in" 
              sx={{ textTransform: 'none', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '20px', padding: '8px 16px' }}
            >
              Login
            </Button>
            <Button 
              color="inherit" href="/sign-up"
              sx={{ textTransform: 'none', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '20px', padding: '8px 16px' }}
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Welcome Section */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#666' }}>
          The easiest way to create flashcards from your text
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2, px: 4, py: 1.5, borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold' }}
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
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Easy Test Input
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Smart Flashcards
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Accessible Anywhere
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Access your flashcards from any device, at any time. Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          {/* Pricing Plan 1 */}
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography sx={{ color: '#666' }}>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: '30px' }}
                onClick={() => handleSubmit('basic')}
              >

                Choose basic
              </Button>
            </Box>
          </Grid>

          {/* Pricing Plan 2 */}
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>$10 / month</Typography>
              <Typography sx={{ color: '#666' }}>
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: '30px' }}
                onClick={() => handleSubmit('pro')}
              >
                Choose pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
