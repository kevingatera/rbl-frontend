import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { payoutArtist, persistArtistRate } from '../features/artists/artistSlice';

function Datatable({ data }) {

  const initialCurrentArtistRate = {
    id: null,
    originalRate: 0,
    newRate: 0
  };

  const [currentArtistRate, setCurrentArtistRate] = useState(initialCurrentArtistRate);

  const dispatch = useDispatch();

  const [internalArtists, setInternalArtists] = useState([...data]);

  const handleChangeRate = (e, row) => {
    e.preventDefault();

    // update the current cell's state
    if (e.target.value !== currentArtistRate.originalRate) {
      setCurrentArtistRate((previousRate) => ({
        ...previousRate,
        originalRate: row.rate,
        newRate: parseFloat(e.target.value),
        id: row.id
      }));
    }

    setInternalArtists((prevState) => {
      const newInternalArtists = prevState.map(artist => {
        if (artist.id === row.id) {
          return { ...artist, rate: parseFloat(e.target.value) };
        }
        return artist;
      });
      return newInternalArtists;
    });

  };

  const onSubmitRate = (e, row) => {
    e.preventDefault();
    const artistData = {
      artistId: row.id,
      newRate: row.rate
    }

    dispatch(persistArtistRate(artistData))
    setCurrentArtistRate(initialCurrentArtistRate);
  };

  const handlePayout = (e, row) => {
    e.preventDefault();

    dispatch(payoutArtist(row.id));
  };

  const handleRateReset = (e, row) => {
    e.preventDefault();
    setInternalArtists([...data]);
    setCurrentArtistRate(initialCurrentArtistRate);
  };

  const columns = [
    {
      name: 'Artist',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Rates',
      sortable: true,
      center: true,
      cell: (row) =>
        <>
          <form onSubmit={e => onSubmitRate(e, row)}>
            <div className="form-group">
              <input type="text" value={row.rate} onChange={e => handleChangeRate(e, row)} step="0.00001" />
            </div>
            <div className={`form-group ${currentArtistRate.id && row.id === currentArtistRate.id && row.rate !== currentArtistRate.originalRate ? null : "hide"}`}>
              <button className='btn' onClick={e => handleRateReset(e, row)}><FaTimes /></button>
              <button className='btn' type="submit"><FaCheck /></button>
            </div>
          </form>
        </>
    },
    {
      name: 'Streams',
      selector: row => row.streams,
      sortable: true,
      center: true,
      maxWidth: '12%'
    },
    {
      name: 'Status',
      minWidth: '33%',
      sortable: true,
      center: true,
      cell: (row) => <div><p className={row.paidStatus === "PAID" ? "success-text" : "error-text"} >{row.paidStatus}</p><i>(Last paid on <b>{row.lastPaidAt}</b> at stream <b>{row.paidStreams}</b>)</i></div>
    },
    {
      name: 'Action',
      center: true,
      maxWidth: '13%',
      cell: (row) =>
        <button className='btn'
          onClick={e => handlePayout(e, row)}
          disabled={row.paidStatus === "PAID"}>
          {row.paidStatus === "PAID" ? "Paid" : "Pay"}
        </button>
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={internalArtists}
      pagination
    />
  );
};

export default Datatable