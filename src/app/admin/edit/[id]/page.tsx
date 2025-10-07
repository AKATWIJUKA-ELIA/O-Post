import React from 'react'
import EditPost from '@/components/Edit/Edit'
import { Id } from '../../../../../convex/_generated/dataModel'

interface props{
        params:{
                id:Id<"posts">
        }
}
const Create = ({params}:props) => {
        const {id} = params
  return (
    <div className="p-4 md:mx-14" >
        <h1 className='text-2xl font-bold mb-4' >Update Post</h1>
        <EditPost id={id} />
    </div>
  )
}

export default Create