'use client'

import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { db } from '@/firebase';
import { 
  Box, Container, TextField, Typography, Paper, Button, Grid, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, AppBar, Toolbar, Snackbar, Alert, CircularProgress 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, collection, getDoc, writeBatch } from 'firebase/firestore';
import Head from 'next/head';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]); 
  const [flipped, setFlipped] = useState({});
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setError('You must be logged in to generate flashcards.');
      setOpenSnackbar(true);
      return;
    }
    if (!text.trim()) {
      setError('Please enter some text to generate flashcards.');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true); // Start loading indicator

    fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ text }), // Send data in JSON format
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false); // Stop loading indicator
        if (Array.isArray(data)) {
          setFlashcards(data); // Expecting an array of flashcards
        } else {
          setError('Invalid response from the server.');
          setOpenSnackbar(true);
        }
      })
      .catch((err) => {
        setLoading(false); // Stop loading indicator
        setError('An error occurred while generating flashcards.');
        setOpenSnackbar(true);
      });
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the flipped state for the clicked card
    }))
  }

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const saveFlashcards = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your flashcards collection.');
      setOpenSnackbar(true);
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        setError("A collection with this name already exists.");
        setOpenSnackbar(true);
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });
    await batch.commit();
    handleClose();
    router.push('/flashcards');
  }

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingTop: '80px', paddingBottom: 5 }}>
      <Head>
        <title>Generate Flashcards Using AI</title>
        <meta name="description" content="Generate flashcards from your text" />
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
              userSelect: 'none',
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
                fontSize: '1.2rem', // Make the button text bigger
                marginRight: 2,    // Add margin to move it left
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ ml: 2 }}> {/* Add margin-left to separate from Home button */}
                  <UserButton />
                </Box>
              </Box>
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box 
        sx={{
          mt: 4, 
          mb: 6, 
          display: 'flex', 
          flexDirection:'column', 
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>Generate Flashcards Using AI</Typography>

        {/* View Saved Flashcards Button */}
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
            onClick={() => router.push('/flashcards')}
          >
            View Saved Flashcards
          </Button>
        </Box>

        <Paper sx={{ p: 4, width: '100%', maxWidth: 800, borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <TextField 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            label="Enter your text here"
            placeholder="Type or paste your text..."
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            sx={{
              mb: 2,
              backgroundColor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6a11cb',
                },
                '&:hover fieldset': {
                  borderColor: '#6a11cb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6a11cb',
                },
              },
            }}
            InputProps={{
              style: { fontSize: '1rem', lineHeight: 1.5 },
            }}
            InputLabelProps={{
              style: { fontSize: '1rem' },
            }}
          />
          <Button
            variant='contained' 
            sx={{ 
              py: 1.5, fontSize: '1rem', fontWeight: 'bold',
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              color: '#fff',
              transition: 'all 0.3s',
              '&:hover': { background: '#5e35b1', transform: 'scale(1.05)' }
            }}
            onClick={handleSubmit} 
            fullWidth
            disabled={loading}  // Disable the button while loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Flashcards'}
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  perspective: '1000px', 
                  border: '2px solid #6a11cb',  // Add colored border to flashcards
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease', // Added transition for smooth hover effect
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)'
                  }
                }}>
                  <CardActionArea onClick={() => handleCardClick(index)} sx={{ height: '100%' }}>
                    <CardContent
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
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant='h6' component="div" sx={{ textAlign: 'center', padding: 2 }}>
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
                          transform: 'rotateY(180deg)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant='h6' component="div" sx={{ textAlign: 'center', padding: 2 }}>
                          {flashcard.back}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant='contained' 
              sx={{ 
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: '30px',
                background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                color: '#fff',
                transition: 'all 0.3s',
                '&:hover': { transform: 'scale(1.05)', backgroundColor: '#5e35b1' }
              }}
              onClick={handleOpen}
            >
              Save Flashcards
            </Button>
          </Box>
        </Box>
      )}

      {/* Save Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Collection Name'
            type='text'
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant='outlined'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
