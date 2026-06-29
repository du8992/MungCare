import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/common.css'; // 공통 스타일(헤더, 네비바, 모달)

function Layout() {
    // 모달 열림/닫힘 상태 관리
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    // 인증 관련 상태 관리
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));

    // 🌟 누락되었던 강아지 통계 데이터 상태 정의 추가!
    const [dogStats, setDogStats] = useState({ count: 0, mainDogName: '없음' });

    // 입력 폼 상태 관리
    const [loginForm, setLoginForm] = useState({ id: '', pw: '' });
    const [signupForm, setSignupForm] = useState({ id: '', pw: '', pwCheck: '' });

    // 로그인/로그아웃 버튼 클릭 핸들러
    const handleAuthButtonClick = () => {
        if (currentUser) {
            // 이미 로그인된 상태 > 로그아웃 처리
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
            alert('로그아웃 되었습니다.');
        } else {
            // 로그아웃 상태 -> 로그인 모달 열기
            setIsLoginOpen(true);
        }
    };

    // 실시간으로 로컬스토리지 정보를 연동하는 훅
    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        setCurrentUser(user);

        if (user) {
            const savedDogs = JSON.parse(localStorage.getItem('dogs')) || [];
            // 현재 로그인한 유저의 강아지들만 필터링
            const myDogs = savedDogs.filter((dog) => dog.owner === user);
            
            // 대표 강아지 찾기 (main이 true인 아이, 없으면 첫 번째 아이, 그것도 없으면 null)
            const mainDog = myDogs.find((dog) => dog.main) || myDogs[0] || null;

            setDogStats({
                count: myDogs.length,
                mainDogName: mainDog ? mainDog.name : '없음'
            });
        } else {
            setDogStats({ count: 0, mainDogName: '없음' });
        }
    }, [currentUser, isLoginOpen]);

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
        alert(`${id}님 환영합니다!`);
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
        alert('회원가입 완료! 로그인 모달창으로 안내합니다.');
        
        setIsSignupOpen(false);
        setIsLoginOpen(true); // 가입 완료 후 바로 로그인 편의 제공
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
                
                {/*  렌더링 짝 보정 및 위젯 레이아웃 분리 구현 */}
                <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {!currentUser ? (
                        /* 로그인 전: 회원가입 + 로그인 버튼 */
                        <>
                            <button id="signupBtn" onClick={() => setIsSignupOpen(true)}>회원가입</button>
                            <button id="loginBtn" onClick={handleAuthButtonClick}>로그인</button>
                        </>
                    ) : (
                        /* 로그인 후: 미니 대시보드 위젯 + 로그아웃 버튼 */
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

            {/* 가변 페이지 콘텐츠 영역 */}
            <main>
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
                            <span id="moveSignup" onClick={() => { setIsLoginOpen(false); setIsSignupOpen(true); }}>
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