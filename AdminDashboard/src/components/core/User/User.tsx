import React from 'react';

interface UserProps {
    name: string;
    age: number;
}

const User: React.FC<UserProps> = ({ name, age }) => {
    return (
        <div>
            <h2>User Component</h2>
            <p>Name: {name}</p>
            <p>Age: {age}</p>
        </div>
    );
};

export default User;