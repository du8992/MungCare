import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import LandingHome from '../pages/LandingHome'; // 🌟 LandingHome 임포트 필수
import '../styles/common.css';

function Layout() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));
    const [dogStats, setDogStats] = useState({ count: 0, mainDogName: '없음' });
    const [loginForm, setLoginForm] = useState({ id: '', pw: '' });
    const [signupForm, setSignupForm] = useState({ id: '', pw: '', pwCheck: '' });

    const handleAuthButtonClick = () => {
        if (currentUser) {
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
            alert('로그아웃 되었습니다.');
            window.location.reload(); // 로그아웃 시 랜딩 페이지로 강제 새로고침
        } else {
            setIsLoginOpen(true);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        setCurrentUser(user);

        if (user) {
            const savedDogs = JSON.parse(localStorage.getItem('dogs')) || [];
            const myDogs = savedDogs.filter((dog) => dog.owner === user);
            const mainDog = myDogs.find((dog) => dog.main) || myDogs[0] || null;
            setDogStats({ count: myDogs.length, mainDogName: mainDog ? mainDog.name : '없음' });
        } else {
            setDogStats({ count: 0, mainDogName: '없음' });
        }
    }, [currentUser, isLoginOpen]);

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
        setLoginForm({ id: '', pw: '' });
        alert(`${id}님 환영합니다!`);
    };

    const handleSignupSubmit = () => {
        const { id, pw, pwCheck } = signupForm;
        if (id === '' || pw === '') { alert('모든 정보를 입력하세요.'); return; }
        if (pw !== pwCheck) { alert('비밀번호가 일치하지 않습니다.'); return; }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find((u) => u.id === id)) { alert('이미 존재하는 아이디입니다.'); return; }

        users.push({ id, pw });
        localStorage.setItem('users', JSON.stringify(users));
        alert('회원가입 완료! 로그인 모달창으로 안내합니다.');
        
        setIsSignupOpen(false);
        setIsLoginOpen(true);
        setSignupForm({ id: '', pw: '', pwCheck: '' });
    };

    return (
        <div className="app-container">
            <header>
                {/* 🌟 로고 클릭 시 홈('/')으로 이동하도록 Link 태그 추가 (스타일 유지를 위해 클래스명 포함) */}
                <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                    MungCare
                </Link>
                
                <nav className="navbar">
                    <ul>
                        <li><NavLink to="/" end>홈</NavLink></li>
                        {/* 로그인했을 때만 나머지 메뉴 노출 */}
                        {currentUser && (
                            <>
                                <li><NavLink to="/profile">내 강아지</NavLink></li>
                                <li><NavLink to="/care">기록</NavLink></li>
                                <li><NavLink to="/notice">커뮤니티</NavLink></li>
                            </>
                        )}
                    </ul>
                </nav>
                
                <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {!currentUser ? (
                        <>
                            <button id="signupBtn" onClick={() => setIsSignupOpen(true)}>회원가입</button>
                            <button id="loginBtn" onClick={handleAuthButtonClick}>로그인</button>
                        </>
                    ) : (
                        <>
                            <div className="my-info-widget">
                                <span className="user-id"> <b>{currentUser}</b>님</span>
                                <span className="divider">|</span>
                                <span className="dog-count">반려견 <b>{dogStats.count}</b>마리</span>
                                <span className="divider">|</span>
                                <span className="main-dog">대표견: <b className="highlight">{dogStats.mainDogName}</b></span>
                            </div>
                            <button id="loginBtn" onClick={handleAuthButtonClick}>로그아웃</button>
                        </>
                    )}
                </div>
            </header>

            {/* 메인 구역 */}
            <main>
                {currentUser ? (
                    <Outlet context={{ currentUser }} />
                ) : (
                    <LandingHome 
                        openLogin={() => setIsLoginOpen(true)} 
                        openSignup={() => setIsSignupOpen(true)} 
                    />
                )}
            </main>

            {/* 로그인 모달 */}
            {isLoginOpen && (
                <div id="loginModal" className="modal">
                    <div className="login-modal-content">
                        <div className="modal-header">
                            <h2>로그인</h2>
                            <button className="close-btn" onClick={() => setIsLoginOpen(false)}>✕</button>
                        </div>
                        <input type="text" placeholder="아이디" value={loginForm.id} onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })} />
                        <input type="password" placeholder="비밀번호" value={loginForm.pw} onChange={(e) => setLoginForm({ ...loginForm, pw: e.target.value })} />
                        <button id="loginSubmit" onClick={handleLoginSubmit}>로그인</button>
                        <div className="signup-link">
                            계정이 없으신가요?{' '}
                            <span id="moveSignup" onClick={() => { setIsLoginOpen(false); setIsSignupOpen(true); }}>회원가입</span>
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
                        <input type="text" placeholder="* 아이디 *" value={signupForm.id} onChange={(e) => setSignupForm({ ...signupForm, id: e.target.value })} />
                        <input type="password" placeholder="* 비밀번호 *" value={signupForm.pw} onChange={(e) => setSignupForm({ ...signupForm, pw: e.target.value })} />
                        <input type="password" placeholder="* 비밀번호 확인 *" value={signupForm.pwCheck} onChange={(e) => setSignupForm({ ...signupForm, pwCheck: e.target.value })} />
                        <button id="signupSubmit" onClick={handleSignupSubmit}>가입하기</button>
                    </div>
                </div>
            )}

            {/* 푸터 영역 */}
            <footer className="site-footer">
                <div className="footer-container">
                    <div className="footer-left">
                        {/* 🌟 푸터의 로고도 클릭 시 홈으로 이동하도록 Link로 변경 */}
                        <Link to="/" className="footer-logo" style={{ textDecoration: 'none' }}>
                            MungCare
                        </Link>
                        <p className="footer-tagline">반려견의 건강한 일상과 행복한 소통을 기록합니다.</p>
                    </div>
                    <div className="footer-right">
                        <div className="footer-links">
                            <a href="https://github.com" target="_blank" rel="noreferrer">Github</a>
                            {/* 로그인 시에만 푸터 링크 작동 */}
                            {currentUser && (
                                <>
                                    <Link to="/notice">커뮤니티</Link>
                                    <Link to="/care">건강기록</Link>
                                </>
                            )}
                        </div>
                        <p className="copyright">© 2026 MungCare. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Layout;