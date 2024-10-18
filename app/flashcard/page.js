'use client'

import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { 
  Card, CardActionArea, CardContent, Container, Grid, Typography, Box,
  AppBar, Toolbar, Button, Snackbar, Alert
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import Head from 'next/head';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []

      docs.forEach((doc)=> {
        flashcards.push({id: doc.id, ...doc.data()})
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [user, search])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    )
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Please sign in to view your flashcards.</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={() => router.push('/sign-in')}
        >
          Sign In
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingBottom: 5 }}>
      <Head>
        <title>{search} Flashcards</title>
        <meta name="description" content="View your flashcards" />
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
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          {/* Left Side: Logo */}
          <Typography 
            variant="h6" 
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
          {/* Right Side: Navigation Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Home Button */}
            <Button 
              sx={{ 
                px: 3, py: 1.2, borderRadius: '25px', 
                transition: 'all 0.3s', 
                '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' }, 
                color: '#fff',
                fontSize: '1.2rem', // Make the button text bigger
                marginRight: 2      // Move the button a bit to the left
              }}
              onClick={() => router.push('/')}
            >
              Home
            </Button>
            <SignedOut>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  sx={{ 
                    px: 3, py: 1.2, borderRadius: '25px', 
                    transition: 'all 0.3s', 
                    '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' }, 
                    color: '#fff',
                    fontSize: '1.2rem'
                  }}
                  href="/sign-in"
                >
                  Login
                </Button>
                <Button 
                  sx={{ 
                    px: 3, py: 1.2, borderRadius: '25px', 
                    transition: 'all 0.3s', 
                    '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' }, 
                    color: '#fff',
                    fontSize: '1.2rem'
                  }}
                  href="/sign-up"
                >
                  Sign Up
                </Button>
              </Box>
            </SignedOut>
            <SignedIn>
              <Box sx={{ ml: 2 }}>
                <UserButton />
              </Box>
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Flashcards Content */}
      <Box sx={{ mt: 12 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
          {search} Flashcards
        </Typography>

        {/* Back to Collections Button */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              borderRadius: '30px',
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              color: '#fff',
              px: 4, py: 1.5,
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'scale(1.05)', 
                background: '#5e35b1' 
              }
            }}
            onClick={() => router.push('/flashcards')}
          >
            Back to Collections
          </Button>
        </Box>

        {flashcards.length > 0 ? (
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  perspective: '1000px', 
                  border: '2px solid #6a11cb',  // Add colored border to flashcards
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)'
                  }
                }}>
                  <CardActionArea onClick={() => handleCardClick(index)} sx={{ height: '100%' }}>
                    <CardContent sx={{ height: '100%', position: 'relative' }}>
                      <Box sx={{ perspective: '1000px', height: '100%' }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.6s',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          }}
                        >
                          {/* Front Face */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              overflow: 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                            }}
                          >
                            <Typography
                              variant='h6'
                              component="div"
                              sx={{ margin: 0, textAlign: 'center', fontWeight: 'bold' }}
                            >
                              {flashcard.front}
                            </Typography>
                          </Box>

                          {/* Back Face */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              overflow: 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              transform: 'rotateY(180deg)',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '8px',
                            }}
                          >
                            <Typography
                              variant='h6'
                              component="div"
                              sx={{ margin: 0, textAlign: 'center', fontWeight: 'bold' }}
                            >
                              {flashcard.back}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            No flashcards found.
          </Typography>
        )}
      </Box>

      {/* Error Snackbar */}
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
  )
}
