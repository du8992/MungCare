    import { useState, useEffect } from 'react';
    import { useOutletContext, useNavigate } from 'react-router-dom';
    import '../styles/notice.css';

    function Notice() {
    const { currentUser } = useOutletContext();
    const navigate = useNavigate();
    
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('free'); // 'free'(자유), 'info'(정보공유)
    const [selectedPost, setSelectedPost] = useState(null); // 상세보기할 게시글
    const [commentText, setCommentText] = useState('');

    // 게시글 로드
    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];
        setPosts(savedPosts);
    }, [selectedPost]);

    // 글쓰기 이동 가드
    const handleWriteClick = () => {
        if (!currentUser) {
        alert('글을 작성하려면 로그인이 필요합니다.');
        return;
        }
        navigate('/notice/write');
    };

    // 정보공유 탭 클릭 가드
    const handleTabChange = (tab) => {
        if (tab === 'info' && !currentUser) {
        alert('정보공유 게시판은 로그인 후 열람할 수 있습니다.');
        return;
        }
        setActiveTab(tab);
    };

    // 좋아요 토글 기능 ID당 1회 제한
    const handleLikeToggle = (postId, e) => {
        e.stopPropagation(); // 리스트 클릭 이벤트 전파 방지
        if (!currentUser) return alert('좋아요는 로그인 후 가능합니다.');

        const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            const likedUsers = post.likedUsers || [];
            const hasLiked = likedUsers.includes(currentUser);
            
            return {
            ...post,
            likedUsers: hasLiked 
                ? likedUsers.filter(user => user !== currentUser) // 이미 누른 경우 취소
                : [...likedUsers, currentUser] // 안 누른 경우 추가
            };
        }
        return post;
        });

        localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
        
        // 상세보기 모달이 열려있다면 모달 데이터도 갱신
        if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(updatedPosts.find(p => p.id === postId));
        }
    };

    // 댓글 등록 기능
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) return alert('댓글은 로그인 후 작성할 수 있습니다.');
        if (!commentText.trim()) return;

        const newComment = {
        id: Date.now(),
        writer: currentUser,
        text: commentText,
        date: new Date().toLocaleDateString()
        };

        

        const updatedPosts = posts.map(post => {
        if (post.id === selectedPost.id) {
            return { ...post, comments: [...(post.comments || []), newComment] };
        }
        return post;
        });

        localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
        setSelectedPost(updatedPosts.find(p => p.id === selectedPost.id));
        setCommentText('');
    };

    //  게시글 삭제 기능
    const handlePostDelete = (postId) => {
        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

        // 전체 게시글에서 해당 ID의 게시글만 제외하고 필터링
        const updatedPosts = posts.filter(post => post.id !== postId);

        // 로컬스토리지 및 State 갱신
        localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
        
        // 상세보기 모달 닫기
        setSelectedPost(null);
        alert('게시글이 삭제되었습니다.');
    };

    // 현재 탭에 맞는 게시글 필터링
    const filteredPosts = posts.filter(post => post.board === activeTab);

    return (
        <div className="notice-container">
        <section className="title-section">
            <h2>커뮤니티</h2>
            <p>자신만의 팁이나 일상을 공유해보세요.</p>
        </section>
        
            <button className="write-btn" onClick={handleWriteClick}>+ 글쓰기</button>
        {/* 탭 메뉴 */}
        <div className="board-tabs">
            <button className={activeTab === 'free' ? 'active' : ''} onClick={() => handleTabChange('free')}>자유게시판</button>
            <button className={activeTab === 'info' ? 'active' : ''} onClick={() => handleTabChange('info')}>정보공유 게시판</button>
        </div>

        {/* 게시글 목록 */}
        <div className="post-list">
            {filteredPosts.length === 0 ? (
            <p className="empty-msg">등록된 게시글이 없습니다.</p>
            ) : (
            filteredPosts.slice().reverse().map(post => (
                <div key={post.id} className="post-item" onClick={() => setSelectedPost(post)}>
                <div className="post-info">
                    <h3>{post.title}</h3>
                    <p className="post-summary">{post.content.substring(0, 60)}...</p>
                    <div className="post-meta">
                    <span> {post.writer}</span>
                    <span> {post.date}</span>
                    <button className={`like-btn-mini ${(post.likedUsers || []).includes(currentUser) ? 'active' : ''}`} onClick={(e) => handleLikeToggle(post.id, e)}>
                        {(post.likedUsers || []).length}
                    </button>
                    <span> {(post.comments || []).length}</span>
                    </div>
                </div>
                {post.image && <img src={post.image} alt="첨부사진" className="post-thumb" />}
                </div>
            ))
            )}
        </div>

        {/*  게시글 상세보기 모달 */}
        {selectedPost && (
            <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
            <div className="post-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedPost(null)}>✕</button>
                <span className="badge">{selectedPost.board === 'free' ? '자유' : '정보공유'}</span>
                <h2>{selectedPost.title}</h2>
                <div className="modal-meta">
                <span>작성자: <b>{selectedPost.writer}</b></span> | <span>{selectedPost.date}</span>
                </div>
                <hr />
                <div className="modal-content">
                <p>{selectedPost.content}</p>
                {selectedPost.image && <img src={selectedPost.image} alt="첨부이미지" className="detail-img" />}
                </div>

                <div className="modal-actions"style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                className={`like-main-btn ${(selectedPost.likedUsers || []).includes(currentUser) ? 'active' : ''}`} 
                onClick={(e) => handleLikeToggle(selectedPost.id, e)}
                >
                    좋아요 {(selectedPost.likedUsers || []).length}
                </button>

                {/* 🌟 내가 쓴 글일 때만 삭제하기 버튼 보이기 */}
                {selectedPost.writer === currentUser && (
                    <button 
                    className="delete-main-btn" 
                    onClick={() => handlePostDelete(selectedPost.id)}
                    
                    >
                    삭제하기
                    </button>
                )}
                </div>

                {currentUser ? (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                    <input type="text" placeholder="댓글을 입력하세요..." value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
                    <button type="submit">등록</button>
                    </form>
                ) : (
                    <p className="login-alert-msg"> 댓글을 작성하려면 로그인이 필요합니다.</p>
                )}
                </div>
            </div>
            
        )}
        </div>
    );
    }

    export default Notice;