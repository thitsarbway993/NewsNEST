import Link from 'next/link';
import { Button, Stack } from '@mui/material';

const categories = [
  { name: 'breaking', label: 'Breaking News' },
  { name: 'latest', label: 'Latest' },
  { name: 'crypto', label: 'Crypto' },
  { name: 'sports', label: 'Sports' },
  { name: 'music', label: 'Music' },
];

export default function NavLinks() {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
      {categories.map((cat) => (
        <Button
          key={cat.name}
          component={Link}
          href={`/${cat.name}`}
          variant="outlined"
        >
          {cat.label}
        </Button>
      ))}
    </Stack>
  );
}