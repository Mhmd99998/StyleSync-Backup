import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  InputBase,
  Paper,
  IconButton,
  List,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash/debounce";
import SearchService from "../../services/SearchService";
import { IndexedProductDto } from "../../models/Search";
import SearchListItem from "./SearchListItem";

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<IndexedProductDto[]>([]);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (!term.trim()) {
          setResults([]);
          return;
        }

        try {
          const res = await SearchService.search(term.trim());
          setResults(res);
        } catch (err) {
          console.error("Search error:", err);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleClickAway = () => {
    setResults([]);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 1,
          px: 2,
          position: "relative",
        }}
      >
        <Paper
          ref={anchorRef}
          sx={{
            width: "80%",
            maxWidth: 950,
            p: 1.5,
            borderRadius: 0.75,
            display: "flex",
            alignItems: "center",
            backgroundColor: "background.default",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
          }}
        >
          <InputBase
            placeholder="Search for products..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              ml: 2,
              flex: 1,
              fontSize: 16,
            }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* Result Dropdown */}
        <Popper
          open={results.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{
            zIndex: 1200,
            mt: 1,
            width: anchorRef.current ? anchorRef.current.clientWidth : undefined,
          }}
        >
          <Paper
            sx={{
              maxHeight: 260,
              overflowY: "auto",
              borderRadius: 2,
              backgroundColor: "background.paper",
              boxShadow: 3,
            }}
          >
            <List>
              {results.map((product) => (
                <SearchListItem
                  key={product.id}
                  product={product}
                  onClick={() => {
                    console.log("Clicked:", product);
                    setSearchTerm("");
                    setResults([]);
                  }}
                />
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
