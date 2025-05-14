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
      <Box className="bg-white shadow-md py-4 sticky top-0 z-10">
        <Box className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {popularCategories.map((category) => (
              <Button
                key={category}
                onClick={() => router.push(`/category/${category.toLowerCase()}`)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
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