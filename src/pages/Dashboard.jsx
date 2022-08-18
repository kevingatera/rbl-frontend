import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import ArtistsDatatable from '../components/ArtistsDatatable'

import Spinner from '../components/Spinner'

import { getArtists } from '../features/artists/artistSlice'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    dispatch(getArtists())
  }, [user, navigate, dispatch])

  const { artists, currentArtist, isLoading, isError, message } = useSelector(
    (state) => state.artists,
  )

  useEffect(() => {
    if (currentArtist) {
      // refresh
      dispatch(getArtists())
    }

    if (isError) {
      toast.error(message)
    }
  }, [artists, currentArtist, isError, message, navigate, dispatch])

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <div>List of artists: </div>
      <div>
        <ArtistsDatatable data={artists} />
      </div>
    </>
  )
}

export default Dashboard
