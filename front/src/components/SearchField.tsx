import React from 'react';
import axios, { CancelTokenSource } from 'axios';
import { Box, Grid, Input } from '@chakra-ui/core';

const cachedResults: any = {};

const makeRequestCreator = () => {
  let cancelToken: CancelTokenSource;

  return (url: string) => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelToken = axios.CancelToken.source();

    return cachedResults[url]
      ? cachedResults[url]
      : axios
          .get(url, { cancelToken: cancelToken.token })
          .then((res) => {
            cachedResults[url] = res.data.results;
            return res.data.results;
          })
          .catch((err: Error) => {
            console.log('Axios error:', err.message);
          });
  };
};

const SearchField = (): JSX.Element => {
  const [value, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;

    setValue(searchValue);
    search(searchValue);
  };

  const [shows, setShows] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const search = async (val: string) => {
    setIsLoading(true);

    const get = makeRequestCreator();

    const apiUrl = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${val}`;
    const res = await get(apiUrl);
    const fetchedShows = await res;

    setShows(fetchedShows);
    setIsLoading(false);
  };

  return (
    <Grid w="sm" m="100px auto">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Enter show name"
        variant="flushed"
        focusBorderColor="teal.500"
      />

      {shows?.length ? (
        <Box>
          {shows.map((show) => (
            <Box key={show.id}>{show.name}</Box>
          ))}
        </Box>
      ) : (
        <Box>There are no shows</Box>
      )}
    </Grid>
  );
};

export default SearchField;
