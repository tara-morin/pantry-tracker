'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography} from '@mui/material'
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
  return <Box width="100vw" height= "100vh" 
          display= "flex" justifyContent="center"
          alignItems= "center" gap={2}> 
          /* 100 means it will be 100% the width of the component */
          /* justifycontent centers it horixontally, align items centers it vertically*/

    <Typography variant= "h1"> Inventory Management</Typography>
    
    </Box>
}