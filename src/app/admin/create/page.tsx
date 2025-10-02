import React from 'react'
import CreatePost from '@/components/Create/CreatePost'
const Create = () => {
  return (
    <div className="p-4" >
        <h1 className='text-2xl font-bold mb-4' >Create a New Post</h1>
        <CreatePost />
    </div>
  )
}

export default Create