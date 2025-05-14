import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'

const Navbar = () => {
  return (
    <>
        <AppBar position="static" color="transparent" elevation={0} className="border-b border-gray-200">
        <Toolbar className="justify-between">
          <Typography variant="h6" className="font-bold text-xl text-black">
            news<span className="text-orange-600">NEST</span>
          </Typography>
          <Box className="space-x-6 hidden md:flex">
            <Typography className="cursor-pointer hover:text-gray-700">News</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar