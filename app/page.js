'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import * as React from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button, Fab, AppBar, Toolbar, IconButton, Divider} from '@mui/material'
import {collection, deleteDoc, getDocs, query, setDoc, getDoc, doc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory]= useState([])
  const [open, setOpen]= useState(false)
  const [itemName, setItemName]= useState('')
  const [expire, setExpiration]= useState('')
  const [brand, setBrand]= useState('')

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
  const removeItem= async(itemName, date, brandName)=> {
    const docRef= doc(collection(firestore,'inventory'),itemName)
    const docSnap= await getDoc(docRef) /*gets the doc if it exists */

    if (docSnap.exists()){ 
      const {quantity}= docSnap.data()
      if (quantity==1){ /* if there's only one of it just delete the item */
        await deleteDoc(docRef)
      }
      else{ /* otherwise just decrease the quantity by 1*/
        await setDoc(docRef, {quantity: quantity-1, expire:date, brand: brandName})
      }
    }
    await updateInventory()
  }
  const addItem= async(itemName, date, brandName)=> {

    const docRef= doc(collection(firestore,'inventory'),itemName)
    const docSnap= await getDoc(docRef)

    if (docSnap.exists()){ 
      const {quantity}= docSnap.data()
      await setDoc(docRef, {quantity: quantity+1, expire:date, brand: brandName})
    }
    else{
      await setDoc(docRef, {quantity:1, expire:date, brand: brandName})
    }
    await updateInventory()
  }


  useEffect( ()=> { /*runs the code in these brackets whenever something in the depency array changes */
    updateInventory() }, []) /*empty dependency array, so inventory is only updated when page loads */

  const handleOpen= ()=> setOpen(true)
  const handleClose= () => setOpen(false)
  return (
    <div>
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          MyPantry
        </Typography>
        <Button 
        bgColor= "#00f7ff"
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
        
      </Toolbar>
    </AppBar>
  </Box>
  <Box 
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
          <Typography variant= "h6"> Add item:</Typography>
          <Stack direction="column" spacing={2}>
          <Typography variant= "h8"> Item</Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }}
          />
          <Typography variant= "h8"> Brand</Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value)
            }}
          />
          <Typography variant= "h8"> Expiration Date (Optional)</Typography>
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
                addItem(itemName, expire, brand)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
            </Stack>
        </Box>
      </Modal>
    <Box border= "1px solid #333" divider={<Divider orientation="vertical" flexItem />}>
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
          Inventory
        </Typography>
      </Box>
  
    <Stack flexDirection="row" alignContent="center">
    <Box width= "150px" height= "100px" textAlign="center" >
    <Typography variant= "h6" alignItems= "center" fontWeight= "bold" sx={{color:'#005eff'}}> Brand</Typography>
    </Box>
    <Box width= "155px" height= "100px">
    <Typography variant= "h6"fontWeight= "bold" textAlign="center" sx={{color:'#005eff'}}> Item</Typography>
    </Box>
    <Box width= "120px" height= "100px"  >
    <Typography variant= "h6"  textAlign="center" fontWeight= "bold" sx={{color:'#005eff'}}> Quantity</Typography>
    </Box>
    <Box width= "50px" height= "100px" textAlign="center" >
    <Typography variant= "h6"  fontWeight= "bold" sx={{color:'#005eff'}}> Expiration Date</Typography>
    </Box>
    </Stack>
  
    <Stack
      width= "800px"
      height= "500px"
      overflow= "auto" /*handles how too many items work. hidden would hide the etxra items */
    >
      {
      inventory.map(({name, quantity, brand, expire})=> (
        <Box
          key= {name}
          width="100%"
          minHeight="150px"
          display="flex"
          alignItems="left"
          justifyContent="space-between"
          bgColor="#f0f0f0"
          padding={4}
        >
          <Typography
            variant="h5"
            color="#333"
          >
            <Box sx= {{textTransform: 'capitalize'}}>{brand}</Box>
          </Typography>
          <Typography
            variant="h5"
            color="#333"
          >
            <Box sx= {{textTransform: 'capitalize'}}>{name}</Box>
          </Typography>
          <Typography
            variant="h5"
            color="#333"

          >
            {quantity}
          </Typography>
          <Typography
            variant="h5"
            color="#333"
          >
            {expire}
          </Typography>
          <Fab size= "medium"sx={{":hover": {bgcolor: "green"}
            }} onClick={()=> {
              addItem(name, expire, brand)
            }}>
              <Typography 
          variant= "h4" 
          color="#4287f5">
          +
        </Typography>
          </Fab>
          
          <Fab size= "medium"sx={{":hover": {bgcolor: "red"}
            }} onClick={()=> {
              removeItem(name, expire, brand)
            }}>
              <Typography 
          variant= "h4" 
          color="#4287f5">
          -
        </Typography>
          </Fab>
        </Box>
      ))
    }
    </Stack>
    </Box>
    </Box>
    </div>
  )


}

/* 100 means it will be 100% the width of the component, justifycontent centers it horixontally, align items centers it vertically*/
/*translate does extra work to center it*/
/* 000 represents the color*/
/* p is padding*/
/* sx means the style is being directly applied to it*/