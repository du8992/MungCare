import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../styles/profil.css';

    function Profile() {
    //  상위 Layout 컴포넌트로부터 현재 로그인된 유저 상태를 전달받음
    const { currentUser } = useOutletContext();

    //  모달 및 강아지 데이터 상태 관리
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [dogs, setDogs] = useState([]);

    //  강아지 등록 폼 상태 관리
    const [dogForm, setDogForm] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
    });
    const [imageFile, setImageFile] = useState(null);

    //  컴포넌트 마운트 및 유저 변경 시 LocalStorage에서 데이터 불러오기
    useEffect(() => {
        const savedDogs = JSON.parse(localStorage.getItem('dogs')) || [];
        setDogs(savedDogs);
    }, [currentUser]);

    // LocalStorage 데이터 저장 로직 플로우 반영
    const saveDogsToStorage = (updatedDogs) => {
        localStorage.setItem('dogs', JSON.stringify(updatedDogs));
        setDogs(updatedDogs);
    };

    //  강아지 등록 처리 핸들러
    const handleSaveDog = () => {
        if (!currentUser) return;

        const baseDogData = {
        id: Date.now(),
        owner: currentUser,
        name: dogForm.name,
        breed: dogForm.breed,
        age: dogForm.age,
        weight: dogForm.weight,
        main: false,
        };

        // 폼 초기화 함수
        const resetForm = () => {
        setDogForm({ name: '', breed: '', age: '', weight: '' });
        setImageFile(null);
        setIsRegisterOpen(false);
        };

        if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newDog = { ...baseDogData, image: e.target.result };
            const updatedDogs = [...dogs, newDog];
            saveDogsToStorage(updatedDogs);
            resetForm();
        };
        reader.readAsDataURL(imageFile);
        } else {
        const newDog = { ...baseDogData, image: '' };
        const updatedDogs = [...dogs, newDog];
        saveDogsToStorage(updatedDogs);
        resetForm();
        }
    };

    //  강아지 삭제 
    const handleDeleteDog = (id) => {
        const updatedDogs = dogs.filter((dog) => dog.id !== id);
        saveDogsToStorage(updatedDogs);
    };

    //  대표 강아지 설정
    const handleSetMainDog = (id) => {
        const updatedDogs = dogs.map((dog) => {
        if (dog.owner === currentUser) {
            return { ...dog, main: dog.id === id };
        }
        return dog;
        });
        saveDogsToStorage(updatedDogs);
    };

    // 현재 로그인한 유저의 강아지만 필터링
    const filteredDogs = dogs.filter((dog) => dog.owner === currentUser);

    return (
        <>
        {/* 타이틀 및 등록 버튼 */}
        <div className="profil-container">
        <section className="title-section">
            <div>
            <h2>My Dog Family</h2>
            <p>내 반려 강아지 정보를 등록하여 관리해보세요.</p>
            </div>
            {currentUser && (
            <button id="addDogBtn" onClick={() => setIsRegisterOpen(true)}>
                + 강아지 등록
            </button>
            )}
        </section>
        
        {/* 강아지 리스트 컨테이너 */}
        <section id="dogContainer" className="dog-grid">
            {!currentUser ? (
            <div className="empty-message" style={{ textAlign: 'center', padding: '50px'  }}>
                로그인 후 이용해주세요.
            </div>
            ) : filteredDogs.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>
                등록된 강아지가 없습니다. 강아지를 등록해 주세요!
            </p>
            ) : (
            filteredDogs.map((dog) => (
                <div key={dog.id} className="dog-card">
                <img
                    src={dog.image || 'https://placehold.co/600x400'}
                    className="dog-image"
                    alt={dog.name}
                />
                <div className="dog-info">
                    {dog.main && <div className="badge">대표 강아지</div>}
                    <h2>{dog.name}</h2>
                    <p>견종 : {dog.breed}</p>
                    <p>나이 : {dog.age}살</p>
                    <p>몸무게 : {dog.weight}kg</p>

                    <div className="card-buttons">
                    <button className="main-btn" onClick={() => handleSetMainDog(dog.id)}>
                        대표 설정
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteDog(dog.id)}>
                        삭제
                    </button>
                    </div>
                </div>
                </div>
            ))
            )}
        </section>
        </div>
        {/* 강아지 등록 모달 */}
        {isRegisterOpen && (
            <div className="modal" id="modal">
            <div className="modal-content">
                <h2>강아지 등록</h2>
                <input
                type="text"
                placeholder="이름"
                value={dogForm.name}
                onChange={(e) => setDogForm({ ...dogForm, name: e.target.value })}
                />
                <input
                type="text"
                placeholder="견종"
                value={dogForm.breed}
                onChange={(e) => setDogForm({ ...dogForm, breed: e.target.value })}
                />
                <input
                type="number"
                placeholder="나이"
                value={dogForm.age}
                onChange={(e) => setDogForm({ ...dogForm, age: e.target.value })}
                />
                <input
                type="number"
                placeholder="몸무게"
                value={dogForm.weight}
                onChange={(e) => setDogForm({ ...dogForm, weight: e.target.value })}
                />
                <input
                type="file"
                id="dogImage"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                />

                <button id="saveDog" onClick={handleSaveDog}>저장</button>
                <button id="closeModal" onClick={() => setIsRegisterOpen(false)}>닫기</button>
            </div>
            </div>
        )}
        </>
    );
    }

    export default Profile;