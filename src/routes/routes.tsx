import { createBrowserRouter } from 'react-router-dom';
import ListCompany from '../users/list';


export const router = createBrowserRouter([
    {
        element: <ListCompany />,
        path: ''
    }
])