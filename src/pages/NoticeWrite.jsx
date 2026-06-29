    import { useState } from 'react';
    import { useOutletContext, useNavigate } from 'react-router-dom';

    function NoticeWrite() {
    const { currentUser } = useOutletContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ board: 'free', title: '', content: '' });
    const [image, setImage] = useState(null);

    // 이미지 등록 핸들러 (LocalStorage 저장을 위해 Base64 문자열로 변환)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // 변환된 base64 주소 세팅
        };
        reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) return alert('로그인이 만료되었습니다.');
        if (!formData.title.trim() || !formData.content.trim()) return alert('제목과 내용을 입력해 주세요.');

        const newPost = {
        id: Date.now(),
        board: formData.board,
        title: formData.title,
        content: formData.content,
        writer: currentUser,
        date: new Date().toLocaleDateString(),
        image: image, // base64 이미지 스트링
        likedUsers: [], // 좋아요 누른 유저 보관 배열
        comments: [] // 댓글 보관 배열
        };

        const savedPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];
        localStorage.setItem('communityPosts', JSON.stringify([...savedPosts, newPost]));
        
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate('/notice');
    };

    return (
        <div className="notice-container">
        <div className="write-card">
            <h2> 새 게시글 작성</h2>
            <form onSubmit={handleSubmit} className="write-form">
            <div className="form-group">
                <label>게시판 선택</label>
                <select value={formData.board} onChange={(e) => setFormData({...formData, board: e.target.value})}>
                <option value="free">자유게시판 (전체 공개)</option>
                <option value="info"> 정보공유 게시판 (회원 전용)</option>
                </select>
            </div>

            <div className="form-group">
                <label>제목</label>
                <input type="text" placeholder="제목을 입력하세요" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>

            <div className="form-group">
                <label>내용</label>
                <textarea rows="10" placeholder="반려견에 대한 이야기나 정보를 공유해 주세요." value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required></textarea>
            </div>

            <div className="form-group">
                <label>사진 첨부</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {image && <img src={image} alt="미리보기" className="preview-img" />}
            </div>

            <div className="write-actions">
                <button type="submit" className="submit-btn">등록하기</button>
                <button type="button" className="cancel-btn" onClick={() => navigate('/notice')}>취소</button>
            </div>
            </form>
        </div>
        </div>
    );
    }

    export default NoticeWrite;