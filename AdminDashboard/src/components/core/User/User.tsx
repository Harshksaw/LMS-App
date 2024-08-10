import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../services/apis';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

interface UserProps {
    name: string;
    age: number;
}

const User: React.FC<UserProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserProps | null>(null);

    useEffect(() => {

        const fetchData = async () => {
            const response = await axios.get(`${BASE_URL}/api/v1/auth/getUserById/${id}`)
            if (!response.data) {
                toast.error("Something went wrong");
                return;
            }
            console.log("🚀 ~ fetchData ~ response:", response.data)

            setUser(response.data.data);
        }

        fetchData();
    }, []);

    return (
        <div>
            <h2 className='text-richblack-5'>User Component</h2>

        </div>
    );
};

export default User;