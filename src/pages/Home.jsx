    import { useState, useEffect } from 'react';
    import { useOutletContext, useNavigate } from 'react-router-dom';
    import '../styles/home.css';

    function Home() {
    const { currentUser } = useOutletContext();
    const navigate = useNavigate();

    const [mainDog, setMainDog] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [latestLog, setLatestLog] = useState(null);

    const [isDogSample, setIsDogSample] = useState(false);
    const [isLogSample, setIsLogSample] = useState(false);

    useEffect(() => {
        // 내 강아지 정보 가져오기
        const savedDogs = JSON.parse(localStorage.getItem('dogs')) || [];
        if (currentUser) {
        const myDogs = savedDogs.filter(dog => dog.owner === currentUser);
        const dog = myDogs.find(dog => dog.main) || myDogs[0] || null;
        
        if (dog) {
            setMainDog(dog);
            setIsDogSample(false);
        } else {
            setMainDog({
            name: '홍길동(예시)',
            breed: '포메라니안',
            age: 2,
            image: null
            });
            setIsDogSample(true);
        }
        } else {
        setMainDog(null);
        setIsDogSample(false);
        }

        // Care 데이터 연동 및 정렬
        const savedLogs = JSON.parse(localStorage.getItem('careLogs')) || [];
        const myLogs = savedLogs
        .filter((log) => log.owner === currentUser)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (myLogs.length > 0) {
        setRecentLogs(myLogs.slice(-5));
        setLatestLog(myLogs[myLogs.length - 1]);
        setIsLogSample(false);
        } else {
        const sampleLogs = [
            { date: '2026-06-26', weight: '4.2', duration: '30', burnedCalories: 270, consumedCalories: 350 },
            { date: '2026-06-27', weight: '4.2', duration: '40', burnedCalories: 310, consumedCalories: 350 },
            { date: '2026-06-28', weight: '4.1', duration: '20', burnedCalories: 230, consumedCalories: 310 },
            { date: '2026-06-29', weight: '4.1', duration: '50', burnedCalories: 350, consumedCalories: 350 },
            { date: '2026-06-30', weight: '4.1', duration: '35', burnedCalories: 290, consumedCalories: 320 },
        ];
        setRecentLogs(sampleLogs);
        setLatestLog(sampleLogs[sampleLogs.length - 1]);
        setIsLogSample(true);
        }

        //  [기능 고도화] 인기 게시글 연동 및 기본 데이터 영구 주입 로직
        let savedPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];
        
        // 저장된 게시글이 하나도 없다면 시스템 기본 웰컴 게시글 3개를 로컬스토리지에 직접 주입합니다.
        if (savedPosts.length === 0) {
        const defaultPosts = [
            { 
            id: 'default_post_1', 
            board: 'info', 
            title: '반려견 여름철 산책 시 주의사항 및 열사병 예방법', 
            content: '여름철 뜨거운 아스팔트는 반려견의 발바닥 패드에 화상을 입힐 수 있습니다. 가급적 해가 진 후나 이른 아침에 산책을 권장하며, 산책 중 수분 공급을 자주 해주세요.',
            author: '운영자',
            date: '2026-06-28',
            likedUsers: ['admin', 'user1', 'user2'], // 인기를 반영하기 위해 가상 좋아요 추가
            comments: [
                { id: 1, author: '훈련사M', content: '좋은 정보 감사합니다! 얼음물을 챙기는 것도 팁입니다.', date: '2026-06-28' }
            ]
            },
            { 
            id: 'default_post_2', 
            board: 'free', 
            title: '오늘 자 반려견 행동 분석 질문드립니다 (배변 패드 관련)', 
            content: '갑자기 잘 가리던 배변 패드 옆에 실수를 하기 시작했어요. 환경이 바뀐 것도 없는데 혹시 스트레스 때문일까요? 비슷한 경험 있으신 분들 조언 부탁드립니다.',
            author: '초보견주',
            date: '2026-06-29',
            likedUsers: ['user3', 'user4'],
            comments: [
                { id: 1, author: '펫닥터', content: '패드의 위치나 청결 상태를 재점검해보시거나 일시적인 시위 행동일 수 있습니다.', date: '2026-06-29' }
            ]
            },
            { 
            id: 'default_post_3', 
            board: 'info', 
            title: '슬개골 탈구 예방에 도움이 되는 실내 홈 트레이닝 가이드', 
            content: '소형견의 고질병인 슬개골 탈구를 예방하기 위해서는 뒷다리 근육 강화가 필수적입니다. 실내에서 가볍게 할 수 있는 "두 발로 서기 밸런스 운동"과 "스텝 박스 오르내리기" 규칙을 공유합니다.',
            author: '재활전문가',
            date: '2026-06-30',
            likedUsers: ['user5'],
            comments: []
            }
        ];
        localStorage.setItem('communityPosts', JSON.stringify(defaultPosts));
        savedPosts = defaultPosts; // 현재 렌더링에 사용할 변수 업데이트
        }

        // 좋아요(likedUsers) 개수가 많은 순서대로 내림차순 정렬하여 상위 3개 추출
        const sortedPosts = savedPosts
        .slice()
        .sort((a, b) => (b.likedUsers || []).length - (a.likedUsers || []).length)
        .slice(0, 3);
        
        setPopularPosts(sortedPosts);
    }, [currentUser]);

    return (
        <div className="home-container">
        <h1 className="home-welcome">
            {currentUser ? `안녕하세요, ${currentUser}님` : 'MungCare 서비스에 오신 것을 환영합니다'}
        </h1>
        <p className="home-subtitle">오늘의 건강 요약 정보와 커뮤니티 트렌드를 확인할 수 있습니다.</p>

        <div className={`home-grid ${!currentUser ? 'guest-mode' : ''}`}>
            
            {/* 반려견 프로필 */}
            <div className={`home-card dog-card-section ${isDogSample ? 'sample-mode' : ''}`} onClick={() => navigate('/profile')}>
            <div className="card-header">
                <h3>반려견 프로필 {isDogSample && <span className="sample-badge">샘플</span>}</h3>
                <span className="move-badge">{isDogSample ? '등록하기' : '상세보기'}</span>
            </div>
            {mainDog ? (
                <div className="home-dog-profile">
                {mainDog.image ? (
                    <img src={mainDog.image} alt={mainDog.name} className="home-dog-img" />
                ) : (
                    <div className="home-dog-no-img">NO IMAGE</div>
                )}
                <div className="home-dog-info">
                    <h4>{mainDog.name} <span className="main-tag">대표</span></h4>
                    <p><b>견종:</b> {mainDog.breed}</p>
                    <p><b>나이:</b> {mainDog.age ? `${mainDog.age}세` : '미지정'}</p>
                </div>
                </div>
            ) : (
                <p className="empty-text">로그인 후 정보를 등록해 주세요.</p>
            )}
            </div>

            {/* 최근 기록 요약 */}
            <div className={`home-card log-card-section ${isLogSample ? 'sample-mode' : ''}`} onClick={() => navigate('/care')}>
            <div className="card-header">
                <h3>최근 기록 요약 {isLogSample && <span className="sample-badge">샘플</span>}</h3>
                <span className="move-badge">{isLogSample ? '기록하기' : '상세보기'}</span>
            </div>
            {recentLogs.length > 0 ? (
                <div className="home-log-list">
                {recentLogs.slice().reverse().map((log, idx) => (
                    <div key={idx} className="home-log-item">
                    <span className="log-date">{log.date}</span>
                    <span className="log-data">체중 {log.weight}kg</span>
                    <span className="log-data">산책 {log.duration}분</span>
                    </div>
                ))}
                </div>
            ) : (
                <p className="empty-text">로그인 후 기록을 작성해 주세요.</p>
            )}
            </div>

            {/* 활동 칼로리 요약 */}
            <div className={`home-card summary-card-section ${isLogSample ? 'sample-mode' : ''}`} onClick={() => navigate('/care')}>
            <div className="card-header">
                <h3>활동 칼로리 요약 {isLogSample && <span className="sample-badge">샘플</span>}</h3>
                <span className="move-badge">상세보기</span>
            </div>
            {latestLog ? (
                <div className="home-summary-box">
                <p className="summary-date-info">기준일: {latestLog.date}</p>
                
                <div className="summary-kcal-row burned">
                    <span className="kcal-label">소모 칼로리 (기초대사량 포함)</span>
                    <span className="kcal-value">{latestLog.burnedCalories} kcal</span>
                </div>
                
                <div className="summary-kcal-row consumed">
                    <span className="kcal-label">사료 섭취 칼로리</span>
                    <span className="kcal-value">{latestLog.consumedCalories || 0} kcal</span>
                </div>

                <div className="summary-footer-tip">
                    {Number(latestLog.burnedCalories) > Number(latestLog.consumedCalories) 
                    ? "섭취량보다 칼로리 소모가 많아 적정 체중 유지에 도움이 되는 하루였습니다."
                    : "사료 보충이 충분한 하루입니다. 균형적인 건강을 위해 가벼운 활동을 권장합니다."
                    }
                </div>
                </div>
            ) : (
                <p className="empty-text">로그인 후 데이터를 확인해 보세요.</p>
            )}
            </div>

            {/* 인기 게시글 (클릭 시 커뮤니티로 라우팅 이동 연동) */}
            <div className="home-card post-card-section" onClick={() => navigate('/notice')}>
            <div className="card-header">
                <h3>인기 게시글</h3>
                <span className="move-badge">바로가기</span>
            </div>
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
                    <span>좋아요 {(post.likedUsers || []).length}</span>
                    <span>댓글 {(post.comments || []).length}</span>
                    </div>
                </div>
                ))}
            </div>
            </div>

        </div>
        </div>
    );
    }

    export default Home;