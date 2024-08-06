'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import {collection, deleteDoc, getDocs, query, setDoc, getDoc, doc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory]= useState([])
  const [open, setOpen]= useState(false)
  const [itemName, setItemName]= useState('')
  const [expire, setExpiration]= useState('')

  const updateInventory= async()=>{ /*updates inventory asynchronously so website doesn't go down when updating it */
    const snapshot= query(collection(firestore,'inventory')) /*query to look at items in inventory firebase */
    const docs= await getDocs(snapshot)
    const inventoryList= [] /*makes empty list to put our items in */
    docs.forEach((doc)=> { /*for each doc in the inventory collection we add it to the list */
    inventoryList.push({
      name: doc.id,
      ...doc.data(),
    })})
    setInventory(inventoryList)
  }
  const removeItem= async(itemName)=> {
    const docRef= doc(collection(firestore,'inventory'),itemName)
    const docSnap= await getDoc(docRef) /*gets the doc if it exists */

    if (docSnap.exists()){ 
      const {quantity}= docSnap.data()
      if (quantity==1){ /* if there's only one of it just delete the item */
        await deleteDoc(docRef)
      }
      else{ /* otherwise just decrease the quantity by 1*/
        await setDoc(docRef, {quantity: quantity-1})
      }
    }
    await updateInventory()
  }
  const addItem= async(itemName, date)=> {

    const docRef= doc(collection(firestore,'inventory'),itemName)
    const docSnap= await getDoc(docRef)

    if (docSnap.exists()){ 
      const {quantity}= docSnap.data()
      await setDoc(docRef, {quantity: quantity+1})
    }
    else{
      await setDoc(docRef, {quantity:1, expire:date})
    }
    await updateInventory()
  }


  useEffect( ()=> { /*runs the code in these brackets whenever something in the depency array changes */
    updateInventory() }, []) /*empty dependency array, so inventory is only updated when page loads */

  const handleOpen= ()=> setOpen(true)
  const handleClose= () => setOpen(false)
  return (<Box 
          width="100vw" 
          height="100vh" 
          display="flex" 
          flexDirection="column" /*makes it so the button and box aren't side by side*/
          justifyContent="center"
          alignItems="center" 
          gap={2}
          > 
      <Modal open= {open} onClose= {handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          width={400}
          bgcolor="palegreen" 
          border="2px solid #000" 
          boxShadow={24} 
          p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3}
          sx={{
            transform:"translate(-50%, -50%)" 
          }}
        >
          <Typography variant= "h6"> Add items</Typography>
          <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }}
          />
          <TextField
            variant="outlined"
            fullWidth
            value={expire}
            onChange={(e) => {
              setExpiration(e.target.value)
            }}
          />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, expire)
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
        onClick={()=> {
          handleOpen()
        }}
        sx={{
          ":hover": {bgcolor: "green"}
        }}
      >
        Add New Item
      </Button>
    <Box border= "1px solid #333">
      <Box
      width="800px"
      height="100px"
      bgcolor="#ADD8E6"
      display="flex"
      alignItems="center"
      justifyContent="center"
        >
        <Typography 
          variant= "h2" 
          color="#333">
          Inventory Items
        </Typography>
      </Box>
    <Stack
      width= "800px"
      height= "500px"
      spacing={2}
      overflow= "auto" /*handles how too many items work. hidden would hide the etxra items */
    >
      {
      inventory.map(({name, quantity, expire})=> (
        <Box
          key= {name}
          width="100%"
          minHeight="150px"
          display="flex"
          alignItems="left"
          justifyContent="space-between"
          bgColor="#f0f0f0"
          padding={7}
        >
          <Typography
            variant="h4"
            color="#333"
            textAlign="center"
          >
            {name}
          </Typography>
          <Typography
            variant="h4"
            color="#333"
            textAlign="right"
            justifyContent="right"
          >
            {quantity}
          </Typography>
          <Typography
            variant="h5"
            color="#333"
            textAlign="right"
            justifyContent="right"
          >
            {expire}
          </Typography>
          <Button 
            variant="contained"
            onClick={()=> {
              removeItem(name)
            }}
            sx={{
              ":hover": {bgcolor: "red"}
            }}
        > Remove </Button>
        </Box>
      ))
    }
    </Stack>
    </Box>
    </Box>
  )
}

/* 100 means it will be 100% the width of the component, justifycontent centers it horixontally, align items centers it vertically*/
/*translate does extra work to center it*/
/* 000 represents the color*/
/* p is padding*/
/* sx means the style is being directly applied to it*/