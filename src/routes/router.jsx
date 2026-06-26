    import { createBrowserRouter } from 'react-router-dom';
    import Layout from '../layouts/Layout';
    import Profile from '../pages/Profile';
    import Care from '../pages/Care'; // 1. 방금 만든 컴포넌트 import

    const Home = () => <div>홈 페이지 화면입니다.</div>;
    const Notice = () => <div>커뮤니티 페이지 화면입니다.</div>;

    const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
        { index: true, element: <Home /> },
        { path: 'profile', element: <Profile /> },
        { path: 'care', element: <Care /> }, 
        { path: 'notice', element: <Notice /> },
        ],
    },
    ]);

    export default router;