// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Link } from 'react-router-dom'
export default function Home() {
    return (
        <div className='flex flex-col  items-center justify-center mt-5'>
            <main className="container mx-auto mt-6">
                <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold mb-4">Add New Rent</h2>
                        <form >
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-semibold">Name</label>
                                <input type="text" id="name" name="name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-semibold">Email</label>
                                <input type="email" id="email" name="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="rentAmount" className="block text-gray-700 font-semibold">Rent Amount</label>
                                <input type="text" id="rentAmount" name="rentAmount" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dueDate" className="block text-gray-700 font-semibold">Due Date</label>
                                <input type="date" id="dueDate" name="dueDate" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add Rent</button>
                        </form>
                    </div>
                </div>
            </main>


        </div >
    )
}
