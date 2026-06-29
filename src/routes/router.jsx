    import { createBrowserRouter } from 'react-router-dom';
    import Layout from '../layouts/Layout';
    import Profile from '../pages/Profile';
    import Care from '../pages/Care'; // 1. 방금 만든 컴포넌트 import
    import Notice from '../pages/notice';
    import NoticeWrite from '../pages/NoticeWrite';
    import Home from '../pages/Home';
    

    const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
        { index: true, element: <Home /> },
        { path: 'profile', element: <Profile /> },
        { path: 'care', element: <Care /> }, 
        { path: 'notice', element: <Notice /> },
        { path: 'notice/write', element: <NoticeWrite />}
        ],
    },
    ]);

    export default router;