    import '../styles/landingHome.css';

    //  Layout에서 보낸 함수들을 인자(props)로 받습니다.
    function LandingHome({ openLogin, openSignup }) {

    return (
        <div className="landing-container">
        {}
        <section className="landing-hero">
            <h1 className="landing-title">반려견 건강 케어의 시작, MungCare</h1>
            <p className="landing-subtitle">
            소중한 아이의 프로필 등록부터 일일 건강 데이터 분석, 반려인 커뮤니티까지 한 번에 관리하세요.
            </p>
            {/*  클릭 시 로그인 모달이 열립니다 */}
            <button className="landing-cta-btn" onClick={openLogin}>
            시작하기
            </button>
        </section>

        {/* 기능 전체 요약 그리드 */}
        <div className="landing-grid">
            
            {/* 반려견 프로필 관리 */}
            <div className="landing-card" onClick={openLogin}>
            <span className="card-tag">PROFILE</span>
            <h3>다중 반려견 프로필 관리</h3>
            <p className="card-desc">
                견종, 나이, 체중 등 반려견의 기본 정보를 기록하고 대표 강아지를 지정하여 맞춤형 관리를 시작할 수 있습니다.
            </p>
            <span className="card-link">프로필 기능 보기</span>
            </div>

            {/* 건강 및 활동 기록 */}
            <div className="landing-card" onClick={openLogin}>
            <span className="card-tag">HEALTH CARE</span>
            <h3>체계적인 일일 건강 기록</h3>
            <p className="card-desc">
                매일 변하는 몸무게와 산책 시간을 기록하세요. 정렬된 리스트를 통해 최근 5일간의 변화 추이를 한눈에 파악합니다.
            </p>
            <span className="card-link">건강 기록 기능 보기</span>
            </div>

            {/*칼로리 자동 분석 */}
            <div className="landing-card" onClick={openLogin}>
            <span className="card-tag">ANALYSIS</span>
            <h3>활동 및 섭취 칼로리 요약</h3>
            <p className="card-desc">
                산책 시간에 따른 소모 칼로리(기초대사량 포함)와 당일 섭취한 사료 칼로리를 자동 분석하여 직관적인 요약 가이드를 제공합니다.
            </p>
            <span className="card-link">칼로리 분석 보기</span>
            </div>

            {/* 반려인 커뮤니티 */}
            <div className="landing-card" onClick={openLogin}>
            <span className="card-tag">COMMUNITY</span>
            <h3>지식 공유 정보망 및 자유 게시판</h3>
            <p className="card-desc">
                다른 반려인들과 유용한 육아 정보를 나누고 소통하세요. 실시간으로 반응이 좋은 인기 게시글을 대시보드에서 바로 확인할 수 있습니다.
            </p>
            <span className="card-link">커뮤니티 구경하기</span>
            </div>

        </div>

        {/* 하단 회원가입 유도 배너 */}
        <section className="landing-banner">
            <h2>지금 가입하고 반려견을 위한 건강 대시보드를 만나보세요</h2>
            <p>간단한 가입만으로 모든 기능을 무료로 이용할 수 있습니다.</p>
            {/*  클릭 시 회원가입 모달이 바로 열립니다 */}
            <button className="landing-sub-btn" onClick={openSignup}>
            가입하기
            </button>
        </section>
        </div>
    );
    }

    export default LandingHome;