import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemText,
  Typography,
  TextField,
  ListItemButton,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import Menuitems from '../sidebar/MenuItems';
import Link from 'next/link';
import { Input } from 'antd';

interface menuType {
  title: string;
  id: string;
  subheader: string;
  children: menuType[];
  href: string;
}

const Search = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Perform search operation with searchQuery
    // For this example, we will just log the searchQuery
    console.log(searchQuery);

    // Reset search input and state
    setSearchQuery('');
    setIsSearching(false);
  };
  if (isSearching) {
    return (
      <div>
        <Input.Search
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

      </div>
    );
  } else {
    return (
      <IconButton
        aria-label="show 4 new mails"
        color="inherit"
        aria-controls="search-menu"
        aria-haspopup="true"
        onClick={handleSearchClick}
        size="large"
      >
        <IconSearch size="16" />
      </IconButton>
    );
  }
};




export default Search;
