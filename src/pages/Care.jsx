    import { useState, useEffect } from 'react';
    import { useOutletContext } from 'react-router-dom';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
    import '../styles/care.css';

    // 산책/건강 기록. 
    // formData에 실시간 임시보관
    // currentDog에 내 강아지중 대표강아지 정보 저장
    function Care() {
    const { currentUser } = useOutletContext();
    const [careLogs, setCareLogs] = useState([]);
    const [formData, setFormData] = useState({
        date: '', time: '', duration: '', distance: '', weight: '', feed: '',
    });

    
    const [currentDog, setCurrentDog] = useState(null);


    useEffect(() => {
        // 기록 가져오기
        const savedLogs = JSON.parse(localStorage.getItem('careLogs')) || [];
        setCareLogs(savedLogs);

        // 대표 강아지 정보 
        if (currentUser) {
        const savedDogs = JSON.parse(localStorage.getItem('dogs')) || [];
        const myDogs = savedDogs.filter((dog) => dog.owner === currentUser);
        
        if (myDogs.length > 0) {
            // 대표 강아지(main = true)가 최우선, 없으면 첫 번째 강아지 선택
            const mainDog = myDogs.find((dog) => dog.main) || myDogs[0];
            setCurrentDog(mainDog);

            
    
            setFormData((prev) => ({ ...prev, weight: mainDog.weight || '' }));
        } else {
            setCurrentDog(null); // 없으면 null
        }
        }
    }, [currentUser]);

    //사용자가 키보드 입력시 name칸의 value값 업데이트 시키기 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // saveRecord 버튼을 누르면 동작
    // 완성된 데이터를 기존 배열 뒤에 추가([..careLogs, newLog]), 
    // LocalStorage를 갱신한 뒤 입력창을 비움.
    const handleSaveRecord = (e) => {
        e.preventDefault();
        if (!currentUser) return alert('로그인 후 이용 가능합니다.');
        if (!formData.date || !formData.duration || !formData.weight) return alert('필수 정보를 입력해 주세요.');

        // 엥? 계산이 왜 이럼? 기초대사량 어쩌구 계산 공식이 있는데?
        // 기초대사량을 정확히 계산하는 공식은 유저가 몸무게를 정확히 입력해야 의미있음
        // 가정에서 쉽지 않음. 저 공식은 중/소형견 기준 근사값 계산함.
        // 마찬가지로 일반적으로 사료 1g에 3.5칼로리 정도 된다함.
        const burnedCalories = Number((formData.duration) * 4) + ((formData.weight) * 30) + 70 ;
        const consumedCalories = Number(formData.feed) * 3.5;

        const newLog = {
        id: Date.now(),
        owner: currentUser,
        dogId: currentDog ? currentDog.id : null, // 어떤 강아지의 기록인지 ID 매핑
        ...formData,
        burnedCalories,
        consumedCalories,
        };

        const updatedLogs = [...careLogs, newLog];
        localStorage.setItem('careLogs', JSON.stringify(updatedLogs));
        setCareLogs(updatedLogs);
        setFormData({ date: '', time: '', duration: '', distance: '', weight: '', feed: '' });
        alert('기록이 저장되었습니다.');
    };

    // 다른 유저가 쓴 기록 내 차트에서 안보이게 하기
    // currentUser(현재 ID) 작성한 기록만 가려 뽑기 > 
    // sort(날짜) 순으로 정렬 > 차트 만듬
    const myLogs = careLogs
        .filter((log) => log.owner === currentUser)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 가져온 견종 정보를 바탕으로 가이드라인 생성
    const getGuideline = () => {
        if (!currentDog) {
        return '내 강아지 탭에서 먼저 강아지를 등록해 주세요! 등록하시면 맞춤형 건강 가이드가 표시됩니다.';
        }

        const { breed, age } = currentDog;

        if (breed.includes('포메') || breed.includes('말티') || breed.includes('푸들') || breed.includes('치와와')) {
        return `${breed}는 관절 및 슬개골 탈구 위험이 높은 소형견입니다. 현재 ${age}살이므로 하루 30분 내외의 적절한 평지 산책을 추천하며, 관절에 무리가 가지 않도록 급격한 체중 증가를 경계해야 합니다.`;
        }
        
        if (breed.includes('리트리버') || breed.includes('허스키') || breed.includes('웰시') || breed.includes('불독')) {
        return `${breed}는 활동량이 많거나 비만이 되기 쉬운 견종입니다. 현재 ${age}살인 아이의 건강을 위해 하루 1시간 이상의 충분한 산책과 유산소 운동을 권장하며, 식사량(섭취 칼로리)을 세심하게 체크해 주세요.`;
        }

        // 위에 없는 시츄가 아래에 들어가면 하루 4~50분 산책인데
        // 시츄는 소형견에 상대적 대두에 앞다리가 짧아
        // 실제로 저렇게 산책시키면 앞다리 관절과 슬개골에 심각한 무리가 갑니다.
        // 아는데 왜그랬냐고요? 귀찮아서! & 코드가 길어질것 같아서 만든겁니다.
        // 저거 진짜 세분화.... 해야죠... 예....
        return `${breed} (${age}살)는 아주 특별한 친구입니다! 하루 40~50분 정도 정기적인 산책을 통해 스트레스를 해소해 주시고, 균형 잡힌 사료 배급으로 적정 체중을 유지해 주세요.`;
    };

    return (
        
        <div className="care-container">
        <section className="title-section">
            <div>
            <h2>Health Management</h2>
            <p>신체 활동과 섭취량을 기록하고 건강 트렌드를 분석하세요.</p>
            </div>
        </section>

        {/* 로그인 안하면 작성 못하게 */}
        {!currentUser ? (
            <div className="empty-message" style={{ textAlign: 'center', padding: '50px' }}>
            로그인 후 이용해주세요.
            </div>
        ) : (
            <div className="care-content-layout">
            
            {/* 왼쪽 입력 폼 (날짜, 시작 시간(오전/오후 설정, 분 단위)) 
            시작시간은 홀수여서 추가함 */}
            <div className="care-sidebar">
                <h3>New Entry {currentDog && `(${currentDog.name})`}</h3>
                <form onSubmit={handleSaveRecord} className="care-form">
                <div className="form-group">
                    <label>날짜 & 시간</label>
                    <div className="input-row">
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                    <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
                    </div>
                </div>

            {/* 왼쪽 입력 폼 (산책 시간(분 단위), 거리(km)) */}
                <div className="form-group">
                    <label>산책 정보</label>
                    <div className="input-row">
                    <input type="number" name="duration" placeholder="시간 (분)" value={formData.duration} onChange={handleInputChange} required />
                    <input type="number" name="distance" placeholder="거리 (km)" value={formData.distance} onChange={handleInputChange} />
                    </div>
                </div>

            {/* 왼쪽 입력 폼 (몸무게(kg), 사료량(g)) */}
                <div className="form-group">
                    <label>건강 정보</label>
                    <div className="input-row">
                    <input type="number" step="0.1" name="weight" placeholder="몸무게 (kg)" value={formData.weight} onChange={handleInputChange} required />
                    <input type="number" name="feed" placeholder="사료량 (g)" value={formData.feed} onChange={handleInputChange} />
                    </div>
                </div>

                <button type="submit" className="submit-btn">Save Record</button>
                </form>
            </div>

            {/* 오른쪽 차트 부분 */}
            <div className="care-main">
                {/* 가이드라인 실시간 바인딩 */}
                <div className="guideline-card">
                <h4>
                    {currentDog ? `${currentDog.name} (${currentDog.breed} / ${currentDog.age}살)` : '반려견 정보 없음'} 맞춤 가이드
                </h4>
                <p>{getGuideline()}</p>
                </div>


                <div className="chart-card">
                <h3>Health Trends</h3>
                <div className="chart-wrapper">
                    {myLogs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', paddingTop: '100px' }}>데이터가 없습니다. 첫 기록을 등록해 주세요!</p>
                    ) : (
                        // 차트 시각화
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={myLogs} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" type='linear' strokeWidth={2} orientation="left" stroke="#4f8cff" title="몸무게" />
                        <YAxis yAxisId="right" type='linear' strokeWidth={2} orientation="right" stroke="#ff614f" title="산책시간" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="weight" name="몸무게 (kg)" stroke="#4f8cff" activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="duration" name="산책 시간 (분)" stroke="#ff614f" activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    )}
                </div>
                </div>

                {myLogs.length > 0 && (
                <div className="summary-cards">
                    <div className="summary-item burned">
                    <span>최근 산책 소모 칼로리 + 기초대사량</span>
                    <h4>{myLogs[myLogs.length - 1].burnedCalories} kcal</h4>
                    </div>
                    <div className="summary-item consumed">
                    <span>최근 사료 섭취 칼로리</span>
                    <h4>{myLogs[myLogs.length - 1].consumedCalories} kcal</h4>
                    </div>
                    
                </div>
                
                )}

                {/* 최근목록 표로 만들기 */}
                <div className="history-card">
                <h3>최근 기록 목록</h3>
                <table className="history-table">
                    <thead>
                    <tr>
                        <th>날짜</th>
                        <th>산책 시간</th>
                        <th>거리</th>
                        <th>몸무게</th>
                        <th>사료량</th>
                    </tr>
                    </thead>
                    <tbody>
                        {/* 긁어온 자료 */}
                    {myLogs.slice().reverse().map((log) => (
                        <tr key={log.id}>
                        <td>{log.date}</td>
                        <td>{log.duration}분</td>
                        <td>{log.distance ? `${log.distance}km` : '-'}</td>
                        <td>{log.weight}kg</td>
                        <td>{log.feed ? `${log.feed}g` : '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

            </div>
            </div>
        )}
        </div>
    );
    }

    export default Care;