import { AppBar, Box, CardMedia, Toolbar, Typography } from '@mui/material'
import React from 'react'

const Navbar = () => {
  return (
    <>
    <Box className="bg-gradient-to-r from-orange-500 to-orange-600 h-1 w-full sticky top-0 z-50" >
      <AppBar position="static" color="transparent" elevation={0} className="border-b border-gray-200 ">
        <CardMedia 
          component="img"
          image="/icons/icon-96x96.png"
          alt="logo"
          className="h-16 w-16 rounded-full mx-auto mt-2"
          sx={{ objectFit: 'contain' }}
        />
        <Toolbar className="justify-between">
          <Typography variant="h6" className="font-bold text-xl text-black">
            news<span className="text-orange-600">NEST</span>
          </Typography>
          <Box className="space-x-6 hidden md:flex">
            <Typography className="cursor-pointer hover:text-gray-700">News</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  )
}

export default Navbar