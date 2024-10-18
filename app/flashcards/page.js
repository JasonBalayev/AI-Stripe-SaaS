'use client'

import { SignedIn, SignedOut, useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { 
  collection, doc, getDoc, setDoc, getDocs, writeBatch 
} from 'firebase/firestore';
import { db } from '@/firebase'; 
import { useRouter } from 'next/navigation';
import { 
  AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardActionArea, CardContent, Snackbar, Alert, Box, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
        setFlashcards([])
      }    
    }
    getFlashcards()
  }, [user])

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

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleDelete = async (collectionName) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.id);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const collections = userDocSnap.data().flashcards || [];
        const updatedCollections = collections.filter(col => col.name !== collectionName);
        await setDoc(userDocRef, { flashcards: updatedCollections }, { merge: true });
        const collectionRef = collection(userDocRef, collectionName);
        const flashcardsSnapshot = await getDocs(collectionRef);
        const batch = writeBatch(db);
        flashcardsSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        setFlashcards(updatedCollections);
        setError('Flashcard collection deleted successfully.');
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while deleting the collection.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingBottom: 5 }}>
      <Head>
        <title>Your Flashcard Collections</title>
        <meta name="description" content="View your flashcard collections" />
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
                px: 3, 
                py: 1.2, 
                borderRadius: '25px', 
                transition: 'all 0.3s', 
                '&:hover': { backgroundColor: '#5e35b1', transform: 'scale(1.05)' }, 
                color: '#fff',
                fontSize: '1.2rem', // Increase font size
                marginRight: 2,     // Move the button a bit to the left
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
                    fontSize: '1.2rem',
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
                    fontSize: '1.2rem',
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

      {/* Flashcard Collections Content */}
      <Box sx={{ mt: 12 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
          Your Flashcard Collections
        </Typography>

        {/* Generate Flashcards Button */}
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
              '&:hover': { transform: 'scale(1.05)', background: '#5e35b1' }
            }}
            onClick={() => router.push('/generate')}
          >
            Generate Flashcards
          </Button>
        </Box>

        {flashcards.length > 0 ? (
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ 
                  height: '100%', position: 'relative', 
                  border: '2px solid #6a11cb',  // Add colored border to flashcards
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)'
                  }
                }}>
                  <CardActionArea 
                    onClick={() => handleCardClick(flashcard.name)}
                    sx={{ height: '100%' }}
                  >       
                    <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(flashcard.name); }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            No flashcard collections found.
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
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  )
}
