'use client'

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get('id');

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

   if (!isLoaded || !isSignedIn) {
        return <></>
   }

   return (
   <Container maxWidth = "100vw">
        <Grid container spacing={3} sx={{mt: 4}}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea onClick={() => handleCardClick(index)}>
                        <CardContent>
                            <Box sx={{ perspective: '1000px' }}>
                                <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '200px', // Keep the fixed height
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.6s',
                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                }}
                                >
                                {/* Front Face */}
                                <Box
                                    sx={{
                                    position: 'absolute',
                                    top: 0, // Ensure the face starts at the top
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    overflow: 'auto', // Enable scrolling
                                    display: 'flex',
                                    flexDirection: 'column', // Stack content vertically
                                    justifyContent: 'flex-start', // Align content to the top vertically
                                    alignItems: 'flex-start', // Align content to the left horizontally
                                    padding: 2,
                                    boxSizing: 'border-box',
                                    backgroundColor: '#fff',
                                    }}
                                >
                                    <Typography
                                    variant='h5'
                                    component="div"
                                    sx={{ margin: 0 }} // Remove default margins
                                    >
                                    {flashcard.front}
                                    </Typography>
                                </Box>

                                {/* Back Face */}
                                <Box
                                    sx={{
                                    position: 'absolute',
                                    top: 0, // Ensure the face starts at the top
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    overflow: 'auto', // Enable scrolling
                                    display: 'flex',
                                    flexDirection: 'column', // Stack content vertically
                                    justifyContent: 'flex-start', // Align content to the top vertically
                                    alignItems: 'flex-start', // Align content to the left horizontally
                                    padding: 2,
                                    boxSizing: 'border-box',
                                    transform: 'rotateY(180deg)',
                                    backgroundColor: '#f0f0f0',
                                    }}
                                >
                                    <Typography
                                    variant='h5'
                                    component="div"
                                    sx={{ margin: 0 }} // Remove default margins
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
   </Container>
   )
}
