'use client'
import { AppBar, Box, CardMedia, Toolbar, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router = useRouter()
  return (
    <>
    <Box className="bg-white h-1 w-full sticky top-0 z-40" >
      <div className="border-b  bg-white border-gray-200 flex justify-start">
        <img src="/icons/icon-96x96.png" className='w-12 object-contain ml-8 cursor-pointer' onClick={()=>router.push('/')}/>
        <Toolbar className="flex justify-between w-full">
          <Typography variant="h6" className="font-bold text-xl text-black cursor-pointer font-bold" onClick={()=>router.push('/')} sx={{ fontWeight: 'bold' }}>
            news<span className="text-orange-600">NEST</span>
          </Typography>
          <Box className="space-x-12 hidden md:flex">
            <Typography className="cursor-pointer text-orange-600 hover:text-gray-700 font-bold " onClick={()=>{router.push('/view-all/latest')}} sx={{ fontWeight: 'bold', marginRight:'1rem', padding:'0.4rem 2rem', borderRadius: '4px', '&:hover': {
              color: 'white',
              backgroundColor: '#ff6900',
            } }}>Latest News</Typography>
            <Typography className="cursor-pointer text-orange-600 hover:text-gray-700 font-bold " onClick={()=>{router.push('/category')}} sx={{ fontWeight: 'bold', marginRight:'1rem', padding:'0.4rem 2rem', borderRadius: '4px', '&:hover': {
              color: 'white',
              backgroundColor: '#ff6900',
            } }}>By Categories</Typography>
          </Box>
        </Toolbar>
      </div>
    </Box>
    </>
  )
}

export default Navbar

