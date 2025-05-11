import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation';
import React from 'react'

const BreakingNews = () => {
    const router = useRouter();
      const handleViewAll = () => {
            router.push('/view-all/news');
        };
  return (
    <>
        <Box className="bg-black text-white py-2 px-4">
            <Typography variant="body2" className="text-center py-2 text-sm">
            <span className="font-semibold text-orange-500 cursor-pointer" onClick={()=>handleViewAll()}>Breaking News:</span> Stay ahead with the latest business insights: comprehensive analysis, real-time updates on breaking news, and in-depth coverage of current market trends.
            </Typography>
        </Box>
    </>
  )
}

export default BreakingNews