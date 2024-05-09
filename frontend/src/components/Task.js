import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import AddTaskModal from "./AddTaskModal.js";
import BtnPrimary from './BtnPrimary'
import DropdownMenu from "./DropdownMenu";
import { useParams, useNavigate } from "react-router";
import ProjectDropdown from "./ProjectDropdown"
import axios from "axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal.js";

function Task() {
    // State variables
    const [isAddTaskModalOpen, setAddTaskModal] = useState(false);
    const [columns, setColumns] = useState({});
    const [isRenderChange, setRenderChange] = useState(false);
    const [isTaskOpen, setTaskOpen] = useState(false);
    const [taskId, setTaskId] = useState(false);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [exportedFilePath, setExportedFilePath] = useState('');
    const [gistUrl, setGistUrl] = useState('');
    const [error, setError] = useState('');
    const { projectId } = useParams();
    const navigate = useNavigate();

    // Function to fetch tasks
    useEffect(() => {
        const fetchTasks = async () => {
            // Set loading state to true
            setIsLoading(true);
            try {
                // Fetch tasks from the backend
                const res = await axios.get(`http://localhost:9000/project/${projectId}`);
                // Log the response data
                console.log('Response data:', res.data);
                // Extract the title from the response
                setTitle(res.data[0].title);
                // Extract tasks from the response and organize them by stage
                const tasksByStage = {
                    "Requested": [],
                    "In Progress": [],
                    "Completed": []
                };
                res.data[0].Todos.forEach(task => {
                    tasksByStage[task.status ? "Completed" : "Requested"].push(task);
                });
                // Set columns state with organized tasks
                setColumns({
                    [uuid()]: {
                        name: "To Do (Pending..❗)",
                        items: tasksByStage["Requested"].sort((a, b) => {
                            return a.order - b.order;
                        })
                    },
                    [uuid()]: {
                        name: "Completed",
                        items: tasksByStage["Completed"].sort((a, b) => {
                            return a.order - b.order;
                        })
                    }
                });
                // Reset render change state
                setRenderChange(false);
            } catch (error) {
                // Log error and display toast message
                console.error('Error fetching tasks:', error);
                toast.error('Failed to fetch tasks. Please try again later.');
            } finally {
                // Set loading state to false
                setIsLoading(false);
            }
        };

        // Fetch tasks when component mounts or when there's a change in dependencies
        if (!isAddTaskModalOpen || isRenderChange) {
            fetchTasks();
        }
    }, [projectId, isAddTaskModalOpen, isRenderChange]);

    // Function to handle drag and drop
    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        let data = {};
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
            data = {
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            };
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
            data = {
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            };

        }

        updateTodo(data);
    };

    // Function to update todo
    const updateTodo = (data) => {
        axios.put(`http://localhost:9000/project/${projectId}/todo`, data)
            .then((res) => {
                console.log('Update response:', res.data); // Log the response data
                // Update title if the response contains the updated title
                if (res.data && res.data.title) {
                    setTitle(res.data.title, () => {
                        console.log('Title updated:', res.data.title); // Log the updated title
                        console.log('Current title:', title); // Log the current title state
                    });
                }
                // Handle other update-related tasks if needed
            })
            .catch((error) => {
                console.error('Update error:', error); // Log any errors
                toast.error('Something went wrong');
            });
    };

    // Function to handle task deletion
    const handleDelete = (e, taskId) => {
        e.stopPropagation();
        axios.delete(`http://localhost:9000/project/${projectId}/task/${taskId}`)
            .then((res) => {
                // Display success message and trigger re-render
                toast.success('Task is deleted');
                setRenderChange(true);
            })
            .catch((error) => {
                // Log error and display toast message
                console.error('Error deleting task:', error);
                toast.error('Failed to delete task. Please try again later.');
            });
    };

    // Function to handle task details
    const handleTaskDetails = (id) => {
        setTaskId({ projectId, id });
        setTaskOpen(true);
    };

    // Function to handle task export
    // Update the handleExport function in your Task component
// Function to handle task export
const handleExport = async () => {
  try {
    const response = await axios.post(`http://localhost:9000/project/${projectId}/export-gist`);
    const { gistUrl } = response.data; // Extract gistUrl from the response
    console.log('Gist URL:', gistUrl); // Log the gist URL
    // Now you can use the gistUrl as needed in your frontend
    // For example, you can open the URL in a new tab:
    window.open(gistUrl, '_blank');
  } catch (error) {
    console.error('Failed to export Gist:', error);
    setError('Failed to export Gist');
  }
};


    return (
        <div className='px-12 py-6 w-full'>
            <div className="flex items-center justify-between mb-6">
                <h1 className='text-xl text-gray-800 flex justify-start items-center space-x-2.5'>
                    <span>{title.slice(0, 25)}{title.length > 25 && '...'}</span>
                    <ProjectDropdown id={projectId} navigate={navigate} />
                </h1>
                <div className="flex space-x-4">
                    <BtnPrimary onClick={() => setAddTaskModal(true)}>Add todo</BtnPrimary>
                     <BtnPrimary onClick={handleExport}>Export Gist</BtnPrimary>
    {exportedFilePath && <p>Exported File Path: {exportedFilePath}</p>}
    {gistUrl && <p>Gist URL: <a href={gistUrl} target="_blank" rel="noopener noreferrer">{gistUrl}</a></p>}
    {error && <p>{error}</p>}
                </div>
            </div>

            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
            >
                <div className="flex gap-5">
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <div
                                className="w-full md:w-3/12 h-[580px]"
                                key={columnId}
                            >
                                <div className="pb-2.5 w-full flex justify-between">
                                    <div className="inline-flex items-center space-x-2">
                                        <h2 className=" text-[#1e293b] font-medium text-sm uppercase leading-3">{column.name}</h2>
                                        <span className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-xs font-semibold text-gray-500 border border-gray-300 ${column.items.length < 1 && 'invisible'}`}>{column.items?.length}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={15} className="text-[#9ba8bc]" viewBox="0 0 448 512"><path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" /></svg>
                                </div>
                                <div>
                                    <Droppable droppableId={columnId} key={columnId}>
                                        {(provided, snapshot) => {
                                            console.log("Droppable Snapshot:", snapshot); // New console log
                                            return (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`min-h-[530px] pt-4 duration-75 transition-colors border-t-2 border-indigo-400 ${snapshot.isDraggingOver && 'border-indigo-600'}`}
                                                >
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                                key={item._id}
                                                                draggableId={item._id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => {
                                                                    console.log("Draggable Snapshot:", snapshot); // New console log
                                                                    return (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{ ...provided.draggableProps.style }}
                                                                            onClick={() => handleTaskDetails(item._id)}
                                                                            className={`select-none px-3.5 pt-3.5 pb-2.5 mb-2 border border-gray-200 rounded-lg shadow-sm bg-white relative ${snapshot.isDragging && 'shadow-md'}`}
                                                                        >
                                                                            <div className="pb-2">
                                                                                <div className="flex item-center justify-between">
                                                                                    <h3 className="text-[#1e293b] font-medium text-sm capitalize">{item.title.slice(0, 22)}{item.title.length > 22 && '...'}</h3>
                                                                                    <DropdownMenu taskId={item._id} handleDelete={handleDelete} projectId={projectId} setRenderChange={setRenderChange} />
                                                                                </div>
                                                                                <p className="text-xs text-slate-500 leading-4 -tracking-tight">{item.description.slice(0, 60)}{item.description.length > 60 && '...'}</p>
                                                                                <span className="py-1 px-2.5 bg-indigo-100 text-indigo-600 rounded-md text-xs font-medium mt-1 inline-block">More Details...</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            );
                                        }}
                                    </Droppable>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModal={setAddTaskModal} projectId={projectId} />
            <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
        </div>
    );
}

export default Task;
