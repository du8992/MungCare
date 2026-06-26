import { Outlet } from 'react-router-dom';
// import Header from './components/Header';

function App() {
  return (
    <div className="app-container">
      {/* <Header /> 공통 헤더가 필요하다면 여기에 위치 */}
      <main>
        {/* URL에 따라 변하는 페이지 컴포넌트들이 여기에 렌더링됩니다 */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default App;