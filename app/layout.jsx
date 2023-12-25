import './globals.css';

import Sidebar from './components/Sidebar';
import Nav from './components/Nav';
import Home from './components/Home';
import MenuModal from './components/modals/MenuModal';
import TaskInfoModal from './components/modals/TaskInfoModal';

import EditTaskModal from './components/modals/task/EditTaskModal';
import AddTaskModal from './components/modals/task/AddTaskModal';
import DeleteTaskModal from './components/modals/task/DeleteTaskModal';

import AddBoardModal from './components/modals/board/AddBoardModal';
import EditBoardModal from './components/modals/board/EditBoardModal';
import DeleteBoardModal from './components/modals/board/DeleteBoardModal';

import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Kanban Task',
  description: 'Simplify your task management',
  icons: ['./icon.png'],
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="flex">
          <Sidebar mode="dark" />
          <div className="flex flex-col w-full h-screen">
            <Nav mode="dark" />
            <Home mode="dark" />
          </div>
          <div className="absolute top-0 left-0 w-full">
            <Toaster />
            <MenuModal />
            <TaskInfoModal />
            <EditTaskModal />
            <AddTaskModal />
            <DeleteTaskModal />
            <AddBoardModal />
            <EditBoardModal />
            <DeleteBoardModal />
          </div>
        </div>
      </body>
    </html>
  );
}
