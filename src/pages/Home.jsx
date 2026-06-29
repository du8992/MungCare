    import { useState, useEffect } from 'react';
    import { useOutletContext, useNavigate } from 'react-router-dom';
    import '../styles/home.css';

    function Home() {
    const { currentUser } = useOutletContext();
    const navigate = useNavigate();

    const [mainDog, setMainDog] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    
    // 차트 표현을 위한 최대값 상태 (비율 계산용)
    const [maxValues, setMaxValues] = useState({ weight: 1, duration: 1 });

    useEffect(() => {
        //  내 강아지 정보 가져오기
        const savedDogs = JSON.parse(localStorage.getItem('dogs')) || [];
        if (currentUser) {
        const myDogs = savedDogs.filter(dog => dog.owner === currentUser);
        const dog = myDogs.find(dog => dog.main) || myDogs[0] || null;
        setMainDog(dog);
        } else {
        setMainDog(null);
        }

        // 최근 기록 가져오기 (날짜 오름차순으로 정렬해야 그래프가 왼쪽->오른쪽 흐름으로 나옵니다)
        const savedLogs = JSON.parse(localStorage.getItem('myLogs')) || [];
        const sortedLogs = savedLogs
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // 옛날 날짜 -> 최신 날짜 순
        .slice(-5); // 최근 5개만 추출
        
        setRecentLogs(sortedLogs);

        // 차트 막대 높이 비율 계산을 위한 최대값 찾기
        if (sortedLogs.length > 0) {
        const maxW = Math.max(...sortedLogs.map(l => Number(l.weight) || 1));
        const maxD = Math.max(...sortedLogs.map(l => Number(l.duration) || 1));
        setMaxValues({ weight: maxW || 1, duration: maxD || 1 });
        }

        // 인기 게시글 Top 3 가져오기
        const savedPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];
        const sortedPosts = savedPosts
        .slice()
        .sort((a, b) => (b.likedUsers || []).length - (a.likedUsers || []).length)
        .slice(0, 3);
        setPopularPosts(sortedPosts);
    }, [currentUser]);

    return (
        <div className="home-container">
        <h1 className="home-welcome">
            {currentUser ? ` 안녕하세요, ${currentUser}님!` : 'MungCare에 오신 것을 환영합니다!'}
        </h1>
        <p className="home-subtitle">오늘 우리 아이의 상태와 커뮤니티 트렌드를 확인해 보세요.</p>

        {/*  이제 4개의 카드가 2x2 혹은 그리드 구조로 예쁘게 떨어집니다 */}
        <div className="home-grid">
            
            {/* 카드 1: 대표 강아지 프로필 */}
            <div className="home-card dog-card-section" onClick={() => navigate('/profile')}>
            <div className="card-header">
                <h3>내 반려견 프로필</h3>
                <span className="move-badge">바로가기 ➔</span>
            </div>
            {mainDog ? (
                <div className="home-dog-profile">
                {mainDog.image ? (
                    <img src={mainDog.image} alt={mainDog.name} className="home-dog-img" />
                ) : (
                    <div className="home-dog-no-img"></div>
                )}
                <div className="home-dog-info">
                    <h4>{mainDog.name} <span className="main-tag">대표</span></h4>
                    <p><b>견종:</b> {mainDog.breed || '미지정'}</p>
                    <p><b>나이:</b> {mainDog.age ? `${mainDog.age}살` : '미지정'}</p>
                </div>
                </div>
            ) : (
                <p className="empty-text">
                {currentUser ? '등록된 강아지가 없습니다.' : '로그인 후 반려견 정보를 등록해 보세요.'}
                </p>
            )}
            </div>

            {/* 카드 2: 최근 5일 건강 기록 요약 */}
            <div className="home-card log-card-section" onClick={() => navigate('/care')}>
            <div className="card-header">
                <h3>최근 기록 요약 (최신순)</h3>
                <span className="move-badge">바로가기 ➔</span>
            </div>
            {recentLogs.length > 0 ? (
                <div className="home-log-list">
                {recentLogs.slice().reverse().map((log, idx) => (
                    <div key={idx} className="home-log-item">
                    <span className="log-date">{log.date}</span>
                    <span className="log-data">{log.weight}kg</span>
                    <span className="log-data">{log.duration}분</span>
                    </div>
                ))}
                </div>
            ) : (
                <p className="empty-text">최근 기록된 건강 내역이 없습니다.</p>
            )}
            </div>

            {/* 카드 3: 신설된 미니 헬스 그래프 차트 */}
            <div className="home-card chart-card-section" onClick={() => navigate('/care')}>
            <div className="card-header">
                <h3>건강 통계 차트 (최근 5회)</h3>
                <span className="move-badge">자세히 보기 ➔</span>
            </div>
            {recentLogs.length > 0 ? (
                <div className="home-chart-container">
                <div className="chart-bars-area">
                    {recentLogs.map((log, idx) => {
                    // 최대값 대비 현재 값의 퍼센트 높이 계산 (최소 높이 15% 보장)
                    const weightHeight = Math.max((Number(log.weight) / maxValues.weight) * 100, 15);
                    const durationHeight = Math.max((Number(log.duration) / maxValues.duration) * 100, 15);

                    return (
                        <div key={idx} className="chart-column">
                        <div className="bar-pair">
                            {/* 체중 막대 (하늘색) */}
                            <div className="bar bar-weight" style={{ height: `${weightHeight}%` }}>
                            <span className="bar-value">{log.weight}k</span>
                            </div>
                            {/* 산책 시간 막대 (주황색) */}
                            <div className="bar bar-duration" style={{ height: `${durationHeight}%` }}>
                            <span className="bar-value">{log.duration}m</span>
                            </div>
                        </div>
                        <span className="chart-date-label">{log.date.substring(5)}</span> {/* 월-일만 표시 */}
                        </div>
                    );
                    })}
                </div>
                <div className="chart-legend">
                    <span className="legend-item"><span className="dot weight-dot"></span>체중(kg)</span>
                    <span className="legend-item"><span className="dot duration-dot"></span>산책(분)</span>
                </div>
                </div>
            ) : (
                <p className="empty-text">차트를 그릴 데이터가 부족합니다.</p>
            )}
            </div>

            {/* 카드 4: 인기 게시글 Top 3 */}
            <div className="home-card post-card-section" onClick={() => navigate('/notice')}>
            <div className="card-header">
                <h3>인기 게시글 Top 3</h3>
                <span className="move-badge">바로가기 ➔</span>
            </div>
            {popularPosts.length > 0 ? (
                <div className="home-post-list">
                {popularPosts.map((post) => (
                    <div key={post.id} className="home-post-item">
                    <div className="post-title-block">
                        <span className={`post-board-badge ${post.board}`}>
                        {post.board === 'free' ? '자유' : '정보'}
                        </span>
                        <span className="post-title-text">{post.title}</span>
                    </div>
                    <div className="post-stats">
                        <span>{(post.likedUsers || []).length}</span>
                        <span>{(post.comments || []).length}</span>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="empty-text">게시글이 아직 없습니다.</p>
            )}
            </div>

        </div>
        </div>
    );
    }

    export default Home;