import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/common.css'; // 공통 스타일(헤더, 네비바, 모달) 연결!

function Layout() {
    //  모달 열림/닫힘 상태 관리
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    //  인증 관련 상태 관리 (기존 updateAuthUI 역할을 State가 대신 수행)
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));

    //  입력 폼 상태 관리
    const [loginForm, setLoginForm] = useState({ id: '', pw: '' });
    const [signupForm, setSignupForm] = useState({ id: '', pw: '', pwCheck: '' });

    // 로그인/로그아웃 버튼 클릭 핸들러
    const handleAuthButtonClick = () => {
        if (currentUser) {
        // 이미 로그인된 상태 > 로그아웃 처리
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        alert('로그아웃 되었습니다.');
        // 강아지 목록 새로고침이 필요한 경우, 페이지가 라우팅 구조로 바꿈 
        // 이 상태를 감지하여 Profile 페이지가 스스로 리렌더링하게 전환.
        } else {
        // 로그아웃 상태 -> 로그인 모달 열기
        setIsLoginOpen(true);
        }
    };

    // 로그인 서브밋 핸들러
    const handleLoginSubmit = () => {
        const { id, pw } = loginForm;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find((u) => u.id === id && u.pw === pw);

        if (!user) {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
        return;
        }

        localStorage.setItem('currentUser', id);
        setCurrentUser(id);
        setIsLoginOpen(false);
        setLoginForm({ id: '', pw: '' }); // 폼 초기화
    };

    // 회원가입 서브밋 핸들러
    const handleSignupSubmit = () => {
        const { id, pw, pwCheck } = signupForm;

        if (id === '' || pw === '') {
        alert('모든 정보를 입력하세요.');
        return;
        }

        if (pw !== pwCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const exists = users.find((u) => u.id === id);

        if (exists) {
        alert('이미 존재하는 아이디입니다.');
        return;
        }

        users.push({ id, pw });
        localStorage.setItem('users', JSON.stringify(users));
        alert('회원가입 완료');
        
        setIsSignupOpen(false);
        setSignupForm({ id: '', pw: '', pwCheck: '' }); // 폼 초기화
    };

    return (
        <div className="app-container">
        {/* 헤더 영역 */}
        <header>
            <div className="logo">MungCare</div>
            <nav className="navbar">
            <ul>
                <li><NavLink to="/" end>홈</NavLink></li>
                <li><NavLink to="/profile">내 강아지</NavLink></li>
                <li><NavLink to="/care">기록</NavLink></li>
                <li><NavLink to="/notice">커뮤니티</NavLink></li>
            </ul>
            </nav>
            <div className="profile">
            {/* 로그인 상태에 따라 회원가입 버튼 조건부 렌더링 */}
            {!currentUser && (
                <button id="signupBtn" onClick={() => setIsSignupOpen(true)}>회원가입</button>
            )}
            <button id="loginBtn" onClick={handleAuthButtonClick}>
                {currentUser ? '로그아웃' : '로그인'}
            </button>
            </div>
        </header>

        {/* 가변 페이지 콘텐츠 영역 */}
        <main>
            {/* 자식 컴포넌트(Profile 등)에게 현재 로그인 유저 상태를 전달할 수 있도록 context 활용 */}
            <Outlet context={{ currentUser }} />
        </main>

        {/* 로그인 모달 */}
        {isLoginOpen && (
            <div id="loginModal" className="modal">
            <div className="login-modal-content">
                <div className="modal-header">
                <h2>로그인</h2>
                <button className="close-btn" onClick={() => setIsLoginOpen(false)}>✕</button>
                </div>
                <input 
                type="text" 
                placeholder="아이디" 
                value={loginForm.id}
                onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })}
                />
                <input 
                type="password" 
                placeholder="비밀번호" 
                value={loginForm.pw}
                onChange={(e) => setLoginForm({ ...loginForm, pw: e.target.value })}
                />
                <button id="loginSubmit" onClick={handleLoginSubmit}>로그인</button>
                <div className="signup-link">
                계정이 없으신가요?{' '}
                <span  id="moveSignup" onClick={() => { setIsLoginOpen(false); setIsSignupOpen(true); }}>
                    회원가입
                </span>
                </div>
            </div>
            </div>
        )}

        {/* 회원가입 모달 */}
        {isSignupOpen && (
            <div id="signupModal" className="modal">
            <div className="login-modal-content">
                <div className="modal-header">
                <h2>회원가입</h2>
                <button className="close-btn" onClick={() => setIsSignupOpen(false)}>✕</button>
                </div>
                <input 
                type="text" 
                placeholder="* 아이디 *" 
                value={signupForm.id}
                onChange={(e) => setSignupForm({ ...signupForm, id: e.target.value })}
                />
                <input 
                type="password" 
                placeholder="* 비밀번호 *" 
                value={signupForm.pw}
                onChange={(e) => setSignupForm({ ...signupForm, pw: e.target.value })}
                />
                <input 
                type="password" 
                placeholder="* 비밀번호 확인 *" 
                value={signupForm.pwCheck}
                onChange={(e) => setSignupForm({ ...signupForm, pwCheck: e.target.value })}
                />
                <button id="signupSubmit" onClick={handleSignupSubmit}>가입하기</button>
            </div>
            </div>
        )}
        </div>
    );
    }

    export default Layout;