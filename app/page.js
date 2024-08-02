'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import {collection, deleteDoc, getDocs, query, setDoc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory]= useState([])
  const [open, setOpen]= useState(false)
  const [itemName, setItemName]= useState('')

  const updateInventory= async()=>{ /*updates inventory asynchronously so website doesn't go down when updating it */
    const current_inventory= query(collection(firestore, 'inventory')) /*query to look at items in inventory firebase */
    const docs= await getDocs(current_inventory) 
    const inventoryList= [] /*makes empty list to put our items in */
    docs.forEach( (doc)=> { /*for each doc in the inventory collection we add it to the list */
    inventoryList.push({
      name: doc.id,
      ...doc.data(),
    })})
    setInventory(inventoryList)
    console.log(inventoryList)
  }
  const removeItem= async(item)=> {
    const docRef= doc(collection(firestore, 'inventory'), item) /*gets us an item directly without having to cycle through all like earlier */
    const docInfo= await getDoc(docRef) /*gets the doc if it exists */

    if (docInfo.exists()){ 
      const {quantity}= docInfo.data()
      if (quantity==1){ /* if there's only one of it just delete the item */
        await deleteDoc(docRef)
      }
      else{ /* otherwise just decrease the quantity by 1*/
        await setDoc(docRef, {quantity: quantity-1})
      }
    }
    await updateInventory()
  }
  const addItem= async(item)=> {
    const docRef= doc(collection(firestore, 'inventory'), item) /*gets us an item directly without having to cycle through all like earlier */
    const docInfo= await getDoc(docRef) /*gets the doc if it exists */

    if (docInfo.exists()){ 
      const {quantity}= docInfo.data()
      await setDoc(docRef, {quantity: quantity+1})
    }
    else{
      await setDoc(docRef, {quantity:1})
    }
    await updateInventory()
  }

  useEffect( ()=> { /*runs the code in these brackets whenever something in the depency array changes */
    updateInventory() }, []) /*empty depency array, so inventory is only updated when page loads */

  const handleOpen= ()=> setOpen(true)
  const handleClose= () => setOpen(false)
  return <Box 
          width="100vw" 
          height= "100vh" 
          display= "flex" 
          flexDirection= "column" /*makes it so the button and box aren't side by side*/
          justifyContent="center"
          alignItems= "center" 
          gap={2}
          > 
      <Modal open= {open} onClose= {handleClose}>
        <Box 
          position= "absolute" 
          top= "50%" 
          left= "50%" 
          width= {400}
          bgcolor= "palegreen" 
          border= "2px solid #000" 
          boxShadow= {24} 
          p={4} 
          display= "flex" 
          flexDirection="column" 
          gap={3}
          sx={{
            transform:"translate(-50%, -50%)" 
          }}
        >
          <Typography variant= "h6"> Add items</Typography>
          <Stack width= "100%" direction= "row" spacing= {2}>
            <TextField>
              variant= "outlined"
              fullWidth
              value= {itemName}
              onChange= {(e)=> {
                setItemName(e.target.value)
              }}
            </TextField>
            <Button
              variant= "outlined"
              onClick= {() => {
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
        variant= "contained"
        onClick= { ()=> {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
    <Box border= "1px solid #333">
      <Box
      width= "800px"
      height= "100px"
      bgcolor= "#ADD8E6"
        >
        <Typography 
          variant= "h2" 
          color= "#333" 
          display= "flex"
          justifyContent="center">
          Inventory Items
        </Typography>
      </Box>
    <Stack
      width= "100px"
      height= "300px"
      spacing= {2}
      overflow= "auto" /*handles how too many items work. hidden would hide the etxra items */
    >
      {
      inventory.map(({name, quantity})=> (
        <Box
          key= {name}
          width= "100%"
          minHeight= "150px"
          display= "flex"
          alignItems="center"
          justifyContent= "source-between"
          bgColor= "#f0f0f0"
          padding= {5}
        >
          <Typography
            variant= "h3"
            color= "#333"
            textAlign= "center"
          >
            {name.charAt(0).toUppercase()+ name.slice(1)}
          </Typography>
          <Typography
            variant= "h3"
            color= "#333"
            textAlign= "center"
          >
            {quantity}
          </Typography>
          <Button 
            variant= "contained"
            onClick= { ()=> {
              removeItem(name)
            }}
        > Remove </Button>
        </Box>
      ))
    }
    </Stack>
    </Box>
    </Box>
}

/* 100 means it will be 100% the width of the component, justifycontent centers it horixontally, align items centers it vertically*/
/*translate does extra work to center it*/
/* 000 represents the color*/
/* p is padding*/
/* sx means the style is being directly applied to it*/