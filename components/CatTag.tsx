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
          <div className="flex gap-4 overflow-x-auto no-scrollbar justify-around py-4">
            {popularCategories.map((category) => (
              <Button
                key={category}
                onClick={() => router.push(`/category/${category.toLowerCase()}`)}
                className="whitespace-nowrap px-4 py-2 rounded-full text-orange-600 bg-orange-100 hover:bg-orange-200"
                sx={{
                  fontWeight: 600,
                  color: '#FFA500',
                  backgroundColor: '##f9fae3',
                  borderRadius: '20px',
                  fontSize: '14px',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solidhsl(25, 49.60%, 49.00%)',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out',

                  },
                }}
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