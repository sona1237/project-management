
import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import BtnPrimary from './BtnPrimary'
import BtnSecondary from './BtnSecondary'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddTaskModal = ({ isAddTaskModalOpen, setAddTaskModal, projectId = null, taskId = null, edit = false, refreshData }) => {

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState(false);
    const [date, setDate] = useState('');
useEffect(() => {
    if (edit && isAddTaskModalOpen) {
        axios.get(`http://localhost:9000/project/${projectId}/task/${taskId}`)
            .then((res) => {
                console.log('Task details fetched successfully:', res.data);
                setTitle(res.data.title); // Update title state here
                setDesc(res.data.description);
                setStatus(res.data.status);
                setDate(res.data.date);
            })
            .catch((error) => {
                console.error('Error fetching task details:', error);
                toast.error('Something went wrong');
            });
        console.log('Edit mode enabled. Fetching task details.');
    }
}, [edit, isAddTaskModalOpen]);

const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", { title, description: desc, status, date });

    if (!edit) {
        axios.post(`http://localhost:9000/project/${projectId}/task`, { title, description: desc, status, date })
            .then((res) => {
                console.log("Response from server:", res.data);
                setAddTaskModal(false);
                toast.success('Task created successfully');
                setTitle('');
                setDesc('');
                setStatus(false);
                setDate('');
                refreshData(); // Refresh task data after successful submission
            })
            .catch((error) => {
                console.error("Error while creating task:", error);
                if (error.response && error.response.status === 422) {
                    console.log("Validation errors:", error.response.data);
                    toast.error(error.response.data.details[0].message);
                } else {
                    toast.error('Something went wrong');
                }
            });
    } else {
        axios.put(`http://localhost:9000/project/${projectId}/task/${taskId}`, { title, description: desc, status, date })
            .then((res) => {
                console.log("Response from server:", res.data);
                setAddTaskModal(false);
                toast.success('Task is updated');
                setTitle('');
                setDesc('');
                setStatus(false);
                setDate('');
                refreshData(); // Refresh task data after successful submission
            })
            .catch((error) => {
                console.error("Error while updating task:", error);
                if (error.response && error.response.status === 422) {
                    console.log("Validation errors:", error.response.data.details);
                    toast.error(error.response.data.details[0].message);
                } else {
                    toast.error('Something went wrong');
                }
            });
    }
};




    return (
        <Transition appear show={isAddTaskModalOpen} as={Fragment}>
            <Dialog as='div' open={isAddTaskModalOpen} onClose={() => setAddTaskModal(false)} className="relative z-50">
                <div className="fixed inset-0 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
                        {/* <div className="fixed inset-0 "> */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="rounded-md bg-white w-6/12">

                                <Dialog.Title as='div' className={'bg-white shadow px-6 py-4 rounded-t-md sticky top-0'}>
                                    {!edit ? (<h1>Add Task</h1>) : (<h1>Edit Task</h1>)}
                                    <button onClick={() => setAddTaskModal(false)} className='absolute right-6 top-4 text-gray-500 hover:bg-gray-100 rounded focus:outline-none focus:ring focus:ring-offset-1 focus:ring-indigo-200 '>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className='gap-4 px-8 py-4'>
                                    <div className='mb-3'>
                                        <label htmlFor="title" className='block text-gray-600'>Title</label>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' placeholder='Task title' />
                                    </div>
                                    <div className='mb-2'>
                                        <label htmlFor="Description" className='block text-gray-600'>Description</label>
                                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' rows="6" placeholder='Task description'></textarea>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="status" className='block text-gray-600'>Status</label>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} className="form-checkbox h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Completed</span>
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="date" className='block text-gray-600'>Date</label>
                                        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' />
                                    </div>
                                    <div className='flex justify-end items-center space-x-2'>
                                        <BtnSecondary onClick={() => setAddTaskModal(false)}>Cancel</BtnSecondary>
                                        <BtnPrimary>Save</BtnPrimary>
                                    </div>
                                </form>

                            </Dialog.Panel>
                        </Transition.Child>

                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default AddTaskModal
