import React, { useEffect, useRef, useState } from 'react'
import { createApi } from 'unsplash-js';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronCircleRight } from 'react-icons/fa';
import { Box, Drawer, Divider, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import ButtonUI from './UI/ButtonUI';
// import CardUI from './UI/CardUI';
// import { list } from 'unsplash-js/dist/methods/photos';
// import { saveBoard, updateBoardImage, getUnsplashApiKey } from 'reduxslices';

const Unsplash = ({ toggleDrawer }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const { isOpen, onOpen, onClose } = useState(options[1]);
  

  const dispatch = useDispatch();
  // const board = useSelector(state => state.boards);

  // let unsplashApiKey = await getUnsplashKey();
  let unsplashApiKey = '1234';
  const unsplashApi = createApi({ accessKey: unsplashApiKey });
  useEffect(() => {
    async function fetchImages() {
      await findImages();
    };
    fetchImages();
    // findImages();
  }, []);

  const findImages = async () => {
    setLoading(true);
    const images = await unsplashApi.search.getPhotos({
      query: query,
      page: currentPage,
      perPage: 10,
      orientation: 'landscape'
    });
    
    // setImages(images.response.results);
    setLoading(false);
  };
  
  const loadMoreImages = async () => {
    setLoading(true);
    const getImages = await unsplashApi.search.getPhotos({
      query: query || 'nature',
      page: currentPage + 1,
      perPage: 10,
      orientation: 'landscape'
    });

    setCurrentPage(currentPage + 1);
    const response = getImages.response.results;
    const totalImages = images.concat(response);
    // setImages(totalImages);

    setLoading(false);
  };

  const imageClickHandler = async (imageUrl) => {
    const data = {
      type: 'backgroundImage',
      value: imageUrl
    };
    // await dispatch(updateBoardImage);
  };

  // const saveBoardHandler = async () => {
  //   await dispatch(saveBoard());
  //   onClose();
  // };

  return (
    <section className="drawer__open">
      <div className="drawer__header">
        <Typography
          id='unsplash-search-title'
          variant='h5'
          component='h2'
        >
          <Box>
            Images
          </Box>
        </Typography>
        <Box className='drawer__header btn'>
          <FaChevronCircleRight
            className="drawer__close-btn"
            onClick={(e) => toggleDrawer(e, false)}
          />
        </Box>
      </div>
      <Divider />
      <div className="drawer__input-group">
        <Input
          id='outlined-basic'
          type='text'
          placeholder='Search Photos'
          label='Outlined'
          variant='outlined'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="drawer__group-btn-col">
          <ButtonUI
            // className='drawer__btn-col'
            variant='outlined'
            // onClick={() => findImages(query)}
          >
            Search
          </ButtonUI>
        </div>
      </div>
        <div className="drawer__images-list">
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
              <div className="drawer__image"></div>
          {/* {images.map((item, index) => {
            return (
              <div className="drawer__image" onClick={() => imageClickHandler(item.urls.regular)}>
                <img
                  className="drawer__img"
                  src={item.urls.small} alt=""
                />
              </div>
            )
          })} */}
        </div>
        <Box
          className='drawer__menu-footer'
        >
          <ButtonUI
            className='drawer__load-more'
            // onClick={(e) => loadMoreImages(e)}
            // isloading={loading}
            // loadingText="Loading Images..."
          >
            Load More
          </ButtonUI>
          {/* <CardUI>
            Searching for info
          </CardUI> */}
        </Box>
    </section>
  )
};
export default Unsplash;