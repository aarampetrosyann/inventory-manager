'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore'
import { Icon } from '@iconify/react'
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#0f172a',
            color: '#ffffff',
            minWidth: '50px',
            height: '30px',
            padding: '0px 0px',
            '&:hover': {
              backgroundColor: '#334155', // Color on hover
            },
          },
        },
      },
    },
  });

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1 || quantity === NaN) {
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)

    try {
      await deleteDoc(docRef)
      console.log('Item ${item} deleted succesfully')
    } catch (error) {
      console.error('Error deleting item $ {item}:', error)
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <ThemeProvider theme={theme}>
      <Box 
        width="100vw" 
        height="100vh" 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        gap={2}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
          position="absolute" 
          top="50%" 
          left="50%"  
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
              />
              <Button
                variant="outlined" 
                sx={{
                  height: "55px",
                  width: "90px"
                }}
                onClick={()=> {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button 
          variant="contained" 
          sx={{
            minWidth: "150px",
            height: "40px"
          }}
          bgcolor="#0EA5E9"
          onClick={() => {
            handleOpen()
          }}
        >
          Add New Item
        </Button>
        <Box border="1px solid #333">
          <Box 
          width="800px"
          height="100px"
          bgcolor="#facc15"
          display="flex"
          alignItems="center"
          justifyContent="center"
          >
            <Typography variant="h2" color="#0f172a">
              Inventory Items
            </Typography>
          </Box>
          <Stack 
            width="800px"
            height="500px"
            spacing={2}
            overflow="auto"
          >
            {inventory.map(({name, quantity}) => (
              <Box 
                key={name} 
                width="100%" 
                minHeight="100px" 
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Stack direction="row" spacing={2}>
                <Typography variant="h4" color="#333" textAlign="left" sx={{ width: "300px"}}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h4" color="#333" textAlign="center"sx={{ width: "50px"}}>
                  {quantity}
                </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name)
                  }}
                >
                  <Icon icon="uil:plus" height="20px"/>
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name)
                  }}
                >
                  <Icon icon="uil:minus" height="20px"/>
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#0f172a",
                    '&:hover': {
                      backgroundColor: '#be123c',
                    },
                  }}
                  onClick={() => {
                    deleteItem(name)
                  }}
                >
                  <Icon icon="uil:trash" height="20px"/>
                </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
