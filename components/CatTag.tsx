import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react'

const CatTag = () => {
    const popularCategories = [
            'Business', 'Technology', 'Sports', 'Entertainment',
                'Science', 'Health', 'Politics', 'World', 'Environment', 'Education'
            ];
    const router = useRouter();
    return (
      <Box className="bg-white shadow-md py-4 ">
        <Box className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar justify-around py-4 flex-wrap">
            {popularCategories.map((category) => (
              <Button
                key={category}
                onClick={() => router.push(`/category/${category.toLowerCase()}`)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                
              >
                {category}
              </Button>
            ))}
          </div>
        </Box>
      </Box>
    )
};

export default CatTag