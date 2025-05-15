import React from 'react';
import {
  Typography,
  Box,
  CardMedia,
  Avatar,
  IconButton,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


export default function Footer() {
  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header, Breaking banner, Stories, Must Read, Business & Sports, Top Creator */}
      {/* Subscription Section */}
      <Box className="bg-gray-100 py-12 px-6 rounded-lg mx-6 mb-12 flex flex-col lg:flex-row items-center justify-between">
        <Box className="max-w-lg  mb-6 lg:mb-0">
          <Typography className="uppercase text-sm font-medium text-gray-500">
            Get first update
          </Typography>
          <Typography variant="h4" className="mt-1 font-bold leading-snug">
            Get the news in front line by{' '}
            <span className="text-red-600">subscribe ✍️</span>{' '}
            our latest updates
          </Typography>
        </Box>
        <Box className=" w-[250px] mr-12 lg:w-auto space-x-2">
          <CardMedia
            component="img"
            height="140"
            image="/icons/icon-152x152.png"
            alt="Description"
          />
        </Box>
      </Box>

      {/* Footer Section */}
      <Box className="bg-white py-12 px-6">
        <Box className="container mx-auto flex flex-col sm:flex-row   ">
          {/* Logo & Social */}
          <Box>
            <Typography variant="h6" className="text-2xl font-bold text-red-600">
              NewsNEST
            </Typography>
            <Typography className="mt-2 text-gray-600">
              Craft narratives that ignite inspiration, knowledge, and entertainment.
            </Typography>
            <Box className="flex space-x-4 mt-4">
              {['facebook','linkedin','twitter','instagram'].map((icon) => (
                <IconButton
                  key={icon}
                  className="bg-white shadow-lg p-2"
                  size="small"
                >
                  <Avatar
                    src={`/icons/icon.png`}
                    variant="square"
                    className="w-5 h-5"
                  />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Footer Links Columns */}
          <Box className="w-full grid grid-cols-3 mt-4 sm:mt-0 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {[
            { title: 'Business', links: ['Startup','Employee','Success','Videos','Markets'] },
            { title: 'Technology', links: ['Innovate','Gadget','Innovative Cities','Upstarts','Future Tech'] },
            { title: 'Travel', links: ['Destinations','Food & Drink','Stay','News','Videos'] },
            { title: 'Sports', links: ['Football','Tennis','Golf','Motosports','Esports'] },
            { title: 'Entertainment', links: ['Movies','Artist','Television','Influencer','Viral'] },
            { title: 'Features', links: ['As Equals','Call to Earth','Freedom Project','Inside Asia','2 Degrees'] },
            { title: 'Weather', links: ['Climate','Storm Tracker','Wildfire Tracker','Earthquake','Video'] },
            { title: 'More', links: ['Design','Mentorship','Investment','Work for Buletin','Support Us'] }
          ].map((col, idx) => (
            <Box key={idx}>
              <Typography className="font-semibold mb-3">{col.title}</Typography>
              <Box className="space-y-2">
                {col.links.map((link) => (
                  <Typography
                    key={link}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer text-sm"
                  >
                    {link}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
          </Box>
        </Box>

        {/* Copyright & Back to Top */}
        <Box className="mt-12 flex justify-between items-center">
          <Typography className="text-gray-500 text-sm">
            © 2025 NewsNEST.
          </Typography>
          <IconButton className="bg-red-600 text-white p-2 hover:bg-red-700">
            <ArrowUpwardIcon onClick={() => window.scrollTo(0, 0)} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
