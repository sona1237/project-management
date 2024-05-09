import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
    return (
        <div className='bg-white'>
            <Navbar />
            <div className='w-screen flex container mx-auto' style={{ height: 'calc(100vh - 56px)' }}>
                <div className="w-[220px]">
                    <Sidebar />
                </div>
                <div className="flex-1">
                    <div className="flex flex-col items-center justify-center h-full">
                        {/* Your content goes here */}
                        {children}
                        {/* Additional content */}
                        <div className="mt-10">
                            <h1 className="text-4xl font-bold mb-4">Home Challenge</h1>
                            <div className="flex flex-col items-center">
                                <img src="https://cdn-icons-png.flaticon.com/512/9402/9402341.png" className="w-20" alt="" />
                                <h1 className="text-lg mt-2">Select or create new project</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppLayout;
