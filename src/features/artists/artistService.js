import axios from 'axios';

const API_URL = '/api/';
axios.defaults.withCredentials = true;

/**
 * Fetch all artists
 * 
 * @returns An array of artists
 */
const fetchArtists = async () => {
  const response = await axios.get(API_URL + 'artists/');

  return response.data.artists;
};

/**
 * Trigger a call to pay the artist 
 * @param {ObjectId} artistId The id of the artist being paid
 * @returns The paid artist's id
 */
const payoutArtist = async (artistId) => {
  const response = await axios.post(API_URL + `artists/${artistId}/payout`);

  return response.data.artistId;
};

/**
 * Trigger a call to change the artist's rate
 * @param {ObjectId} artistId The id of the artist being paid
 * @returns The paid artist's id
 */
const changeRateArtist = async (artistId, newRate) => {
  const response = await axios.post(API_URL + `artists/${artistId}/changeRate`, null, { params: { newRate } });

  return response.data.artistId;
};

const artistService = {
  fetchArtists,
  payoutArtist,
  changeRateArtist
};

export default artistService;
