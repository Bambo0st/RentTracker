import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Owner from './Owner';

export default function Home() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/sign-in');
        }
    }, [currentUser, navigate]);

    return currentUser ? <Owner /> : null;
}
