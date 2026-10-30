# Paper, Box and Masonry

- **Paper**: a plain surface (MUI Paper).
  - `elevation`: 0, 1 (card shadow) or 2 (popover shadow)
  - `outlined`
  - `tone`: raised, sunken or page
  - `padding` and `radius`

  Card is Paper plus a title and layout.
- **Box**: a generic wrapper with token spacing and colors (MUI Box): `<Box p={4} bg="primary-soft" radius="md">`. Use Stack, Grid or Tailwind for layout first.
- **Masonry**: cards of different heights packed into columns (MUI Lab Masonry): `<Masonry columns={3} gap={4}>`. Items run top to bottom down each column. On phones it switches to 2 columns.
