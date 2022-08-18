import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import {
  payoutArtist,
  persistArtistRate,
} from '../features/artists/artistSlice'

function ArtistsDatatable({ data }) {
  const initialCurrArtistRate = {
    id: null,
    originalRate: 0,
    newRate: 0,
  }

  const [currArtistRate, setCurrArtistRate] = useState(initialCurrArtistRate)

  const dispatch = useDispatch()

  const [internalArtists, setInternalArtists] = useState([...data])

  const handleChangeRate = (e, row) => {
    e.preventDefault()

    // update the current cell's state
    if (e.target.value !== currArtistRate.originalRate) {
      setCurrArtistRate((previousRate) => ({
        ...previousRate,
        originalRate: row.rate,
        newRate: parseFloat(e.target.value),
        id: row.id,
      }))
    }

    setInternalArtists((prevState) => {
      const newInternalArtists = prevState.map((artist) => {
        if (artist.id === row.id) {
          return { ...artist, rate: parseFloat(e.target.value) }
        }
        return artist
      })
      return newInternalArtists
    })
  }

  const onSubmitRate = (e, row) => {
    e.preventDefault()
    const artistData = {
      artistId: row.id,
      newRate: row.rate,
    }

    dispatch(persistArtistRate(artistData))
    setCurrArtistRate(initialCurrArtistRate)
  }

  const handlePayout = (e, row) => {
    e.preventDefault()

    dispatch(payoutArtist(row.id))
  }

  const handleRateReset = (e) => {
    e.preventDefault()
    setInternalArtists([...data])
    setCurrArtistRate(initialCurrArtistRate)
  }

  const renderEditableTableCell = (row) => {
    const enableHide =
      currArtistRate.id &&
      row.id === currArtistRate.id &&
      row.rate !== currArtistRate.originalRate

    return (
      <form onSubmit={(e) => onSubmitRate(e, row)}>
        <div className="form-group">
          <input
            type="text"
            value={row.rate}
            onChange={(e) => handleChangeRate(e, row)}
            step="0.00001"
          />
        </div>
        <div className={`form-group ${enableHide ? null : 'hide'}`}>
          <button className="btn" onClick={(e) => handleRateReset(e)}>
            <FaTimes />
          </button>
          <button className="btn" type="submit">
            <FaCheck />
          </button>
        </div>
      </form>
    )
  }

  const renderStatusCell = (row) => (
    <div>
      <p className={row.paidStatus === 'PAID' ? 'success-text' : 'error-text'}>
        {row.paidStatus}
      </p>
      <i>
        (Last paid on <b>{row.lastPaidAt}</b> at stream <b>{row.paidStreams}</b>
        )
      </i>
    </div>
  )

  const renderActionCell = (row) => (
    <button
      className="btn"
      onClick={(e) => handlePayout(e, row)}
      disabled={row.paidStatus === 'PAID'}
    >
      {row.paidStatus === 'PAID' ? 'Paid' : 'Pay'}
    </button>
  )

  const columns = [
    {
      name: 'Artist',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Rates',
      sortable: true,
      selector: (row) => row.rate,
      center: true,
      cell: renderEditableTableCell,
    },
    {
      name: 'Streams',
      selector: (row) => row.streams,
      sortable: true,
      center: true,
      maxWidth: '12%',
    },
    {
      name: 'Monthly',
      minWidth: '50px',
      selector: (row) => row.avgMonthly,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      minWidth: '33%',
      sortable: true,
      selector: (row) => row.paidStatus,
      center: true,
      cell: renderStatusCell,
    },
    {
      name: 'Action',
      center: true,
      maxWidth: '13%',
      cell: renderActionCell,
    },
  ]

  return <DataTable columns={columns} data={internalArtists} pagination />
}

ArtistsDatatable.propTypes = {
  data: PropTypes.array,
}

export default ArtistsDatatable
