import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const houseIconUrl = '/icon.jpg';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);

    return (
        <header className="bg-red-500 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                {/* House Icon */}
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src={houseIconUrl}
                        alt="House Icon"
                        className="h-10 w-10 rounded-full border-2 border-transparent transition duration-300 hover:border-red-500"
                    />
                    <h1 className="font-bold text-lg sm:text-xl text-white">RentTrackr</h1>
                </Link>

                {/* Search Form */}
                <form className="flex items-center bg-white bg-opacity-75 rounded-lg px-2 py-1 shadow-sm">
                    <input type="text" placeholder="Search" className="bg-transparent focus:outline-none w-24 sm:w-64 text-gray-800 px-2 py-1" />
                    <button type="submit" className="text-gray-800 hover:text-red-600">
                        <FaSearch />
                    </button>
                </form>

                {/* Navigation Links */}
                <nav className="flex items-center space-x-4">
                    <Link to="/" className="text-white hover:text-white transition duration-300">
                        Home
                    </Link>
                    <Link to="/about" className="text-white hover:text-white transition duration-300">
                        About
                    </Link>
                    <Link to="/profile" className="flex items-center text-white hover:text-white transition duration-300">
                        {currentUser ? (
                            <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />
                        ) : (
                            <span>Sign In</span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
