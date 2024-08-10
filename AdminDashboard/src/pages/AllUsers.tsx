import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BASE_URL } from '../services/apis'
import UserTable from '../components/core/User/UsersTable'

const AllUsers = () => {


  const [users, setUsers] = useState([])
  

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`);
      if (!res.data) {
        toast.dismiss();
        toast.error("something went wront");
        return;
      }
      console.log(res?.data)
      setUsers(res?.data?.data)
    }

    fetchUsers()
  }, [])

  console.log("🚀 ~ AllUsers ~ users:", users)
  return (
    <div>
 <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">USERS</h1>
      
      </div>
      {users && <UserTable users={users}  loading={false} />}

    </div>
  )
}

export default AllUsers
